"use strict";

//bonobo does his thing. he goes through all the plugin directories and gets all models and all setup functions from there,
//he also can execute them.

var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , utils = require(path.join(__dirname,'base/utils'))
  , server = require(path.join(__dirname, 'server')); 

var bonobo = module.exports = {
  
    rootDir : __dirname
  
    //plugin object that holds the plugins
  , plugins : {}
  
    //will be added to to enable models in plugins
  , modelPaths : []
  
    //these will be used in base.config to setup middleware for the various plugins
  , middleWare: []
  
    //reqs holds the http requests the plugins register  
  , reqs : {
        gets: []
      , posts: []
    }
};

bonobo.init = function(rootDir, cb){
  
  bonobo.pluginDir = rootDir;
  
  var readDirs = fs.readdirSync(rootDir);
  
  //load and init plugins
  for(var i = 0; i < readDirs.length; i++) {
    
    var pluginName = readDirs[i];
    
    var filename = path.join(rootDir, pluginName, pluginName);
    
    require(filename).init(bonobo, function(err, plugin) {
      //~ console.log('initing '+pluginSettings.name.value+" err ="+err);
      bonobo.plugins[pluginName] = plugin;
      
      if(i >= readDirs.length -1) {
        cb(bonobo);
      }
    });
  }
}

var messages = [];
  
bonobo.DoTheSetup = function(cb) {
  
  var errs = []
    , msgs = []
    , setups = []
    , i = 0;
  
  //execute the setupscript for each plugin
  for(var idx in bonobo.plugins) {
    var setupDir = path.join(bonobo.plugins[idx].rootDir, 'setup.js');
    //~ console.log('setupDir ='+setupDir);
    //~ console.log('fs.existssync says '+fs.existsSync(setupDir));
    
    if(fs.existsSync(setupDir) ){
      var setup = require(path.join(bonobo.plugins[idx].rootDir, 'setup'));
        
      
      //only if exists and executable
      if(setup && setup.init && typeof setup.init === 'function') {
        //~ console.log('adding '+setup+" to setups");
        setups.push(setup);
      }
    }
  }
  
  
  utils.each(setups, function(setUp) {
    var setup = setUp.value;
    
    if(setup && setup.init && typeof setup.init === 'function') {
     
      setup.init(bonobo, function(err, msg) {
        
        if(err) utils.each(errs,function(err){errs.push(err)});
        if(msg) utils.each(msgs,function(msg){msgs.push(msg)});
        
        i++;
        
        console.log(i+' i >= setups.length '+setups.length);
        
        if(i >= utils.count(setups) ) {
          //this returns to the base setup route in ./base/routes/setup and shows the setup view
          cb(errs, msgs);
        }
      });
    }
  });
}


bonobo.DoTheMiddleWare = function(base, req,res, next) {
  var i = 0;
  
  utils.each(bonobo.middleWare, function(mW) {
    if(typeof mW === 'function') {
      base.use(mW);
    }
    
    i++;
    
    console.log('i = '+i+' utils.count(bonobo.middleWare) = '+utils.count(bonobo.middleWare));
    if(i >= utils.count(bonobo.middleWare)) {
      next();
    }
  });
}

bonobo.DoThemModels = function(base, cb) {
  
  base.modelPaths.push(path.join(base.rootDir, '/models'));
  
  for(var idx in bonobo.plugins) {
    
    var p = bonobo.plugins[idx].modelPaths;
    if(p) {
    //~ console.log('bonobo.modelPaths['+idx+'] '+bonobo.modelPaths[idx]);
      base.modelPaths.push(p);
    }
  }
  
  // load and setup models from all plugins
  for(var idx in base.modelPaths) {
    
    var p = base.modelPaths[idx];
    
    if(p && p[p.length-1] !== '/'){
      p = p+'/';
    }
  
    if(fs.existsSync(p) != false) {
      
      //load every file found in every modelpath dir
      fs.readdirSync(p).forEach(function (file) {
        //~ console.log('enabling model '+path.join(p, file));
        require(path.join(p, file));
      });
    }
  }
  
  cb(null);
}

bonobo.RouteThemAll = function(base, cb) {
 
  //first handle errors:
  //load and setup routes
  base.routes.pages = require(path.join(base.rootDir, '/routes/page')).page;
  base.routes.setup = require(path.join(base.rootDir, '/routes/setup'));
  
  if( !base.locals.pageData ) {
   //~ setup post and get for the setup page. settings can be changed later using the admin module
    base.get('/setup', base.routes.setup.gets.setup);
    base.post('/setup', base.routes.setup.posts.setup);
  }
  
  var doneI = 0;
  for(var pluginName in bonobo.plugins) {
    var pl = bonobo.plugins[pluginName];
    
    doneI++;
    
    if(pl && pl.setupRoutes && typeof pl.setupRoutes === "function") {
      pl.setupRoutes(bonobo, function() {
       
        if(doneI >= utils.count( bonobo.plugins) ) {
          //~ console.log('plugin setuproutes doneI ='+doneI+" bonobo.plugins.length = "+utils.count(bonobo.plugins));
        
               
          // setup page requests

          //first set the user of this request:
          
          base.get("*", function(req,res, next) {
            base.locals.currentUser = req.user;
            next();
          });

          base.gets = [];
          base.posts = [];
          
          base.gets.push({ url: '/', route: base.routes.pages});
            
          //get the requests from the plugins and add them to the base requests
          
          for(var plIdx in bonobo.plugins) {
            var reqs = bonobo.plugins[plIdx].reqs;
            //~ console.log('reqs = ');
            //~ console.log(reqs);
            
            for(var idx in reqs) {
              
              var verbs = reqs[idx];
              //~ console.log('verbs = ');
              //~ console.log(verbs);
              for(var verb in verbs) {
                var fE = verbs[verb];
                //~ console.log('fE =');
                //~ console.log(fE);
                if(fE.url && fE.route) {
                  base[idx].push(fE);
                }
              }
            }
          }
          
          //pushing this last ensures the 4oh4 page gets called and this url filter works.
          base.gets.push({url: '/:page', route: base.routes.pages});
          
          for(var idx in base.gets) {
            var getter = base.gets[idx];
            if(getter.url && getter.route) {
              //~ console.log('initialise getter:');
              //~ console.log(getter);
              if(getter.middleware) {
                base.get(getter.url, getter.middleware, getter.route);
                return;
              }
              
              base.get(getter.url, getter.route);
            }
          }

          for(var idx in base.posts){
            var poster = base.posts[idx];
            if(poster.url && poster.route) {
              //~ console.log('initialise poster:');
              //~ console.log(poster);
              if(poster.middleware) {
                base.post(poster.url, poster.middleware, poster.route);
                return;
              }
              
              base.post(poster.url, poster.route);
            }
          }
          
          var Route4oh4 = function(req,res) {
            res.redirect('4oh4');
          }
          
          //4oh4 page handler
          base.get("*", Route4oh4);
          base.post("*", Route4oh4);
          
          cb(null);
        }
      });
    }
  }
}


bonobo.addPluginSettings = function(pluginSettings, cb) {
  
  if(!pluginSettings || !pluginSettings.name.value){
    cb("bonobo.addPluginSettings needs a pluginname and pluginsettings to work");
    return;
  }else{
    console.log('bonobo startint settings setup for '+pluginSettings.name.value);
  }
  
  var Setting = mongoose.model("Setting");
  
  var setting = new Setting();
  
  setting.name = pluginSettings.name.value;
  setting.opts = pluginSettings;
  
  setting.save(function(err) {
    bonobo.plugins[setting.name].settings = setting;
    //~ console.log('settings setup for '+pluginSettings.name.value+' completed with error:'+err);
    cb(err, setting);
  });
  
}

bonobo.getPluginSettings = function(pluginSettings, cb) {
  var settings = bonobo.plugins[pluginSettings.name.value].settings;
 
  if(settings && typeof settings === "object") {
    cb(null, settings);
    return;
  }
  
  var Setting = mongoose.model("Setting");
  
  Setting.findOne({slug: utils.slugify(pluginSettings.name.value)}, function(err, setting) {
    
    if(!setting) {
      bonobo.addPluginSettings(pluginSettings, cb);
    }else{
      cb(err, setting);
    }
  });
}

bonobo.updateOrSavePluginSettings = function(pluginSettings, cb) {
  if(!pluginSettings || typeof pluginSettings !== "object") {
    console.log('invalid settings object passed to bonobo.updateOrSavePluginSettings');
  }
  
  var errs = []
    , msgs = [];
    
  mongoose.model("Setting").findOne({slug: utils.slugify(pluginSettings.name.value)}, function(err, setting) {
    
    if(err) {
      errs.push({message: err, css: 'fail'});
    }
    
    if(!setting) {
      pluginSettings.save(function(err,msg) {
        
        if(errs.length == 0) {
          msgs.push({message: 'pluginSettings for '+pluginSettings.name.value+' saved successful', css: 'win'});
        }else{
          errs.push({message: 'pluginSettings for '+pluginSettings.name.value+' saved with errors', css: 'fail'});
        }
        
        cb(errs, msgs);
      });
    }else{
      setting.update({$set: {opts: pluginSettings.opts.value}},function(err) {
         if(errs.length == 0) {
          msgs.push({message: 'pluginSettings for '+pluginSettings.name.value+' updated successful', css: 'win'});
        }else{
          errs.push({message: 'pluginSettings for '+pluginSettings.name.value+' updated with errors', css: 'fail'});
        }
        
        cb(errs, msgs);
      });
    }
    
  });
  
}
