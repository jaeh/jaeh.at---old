"use strict";

//bonobo does his thing. he goes through all the plugin directories and gets all models and all setup functions from there,
//he also can execute them.

var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , base = require(path.join(__dirname,'base/base'))
  , utils = require(path.join(__dirname,'base/utils'))
  , server = require(path.join(__dirname, 'server')); 

var bonobo = module.exports = {
  
    rootDir : __dirname
  
    //plugin object that holds the plugins
  , plugins : {}
  
    //will be added to to enable models in plugins
  , modelPaths : []
  
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
  
  //~ console.log('bonobo.plugins length='+server.utils.getObjectLength(bonobo.plugins)+" object=");
  //~ console.log(bonobo.plugins );
  
  var setups = [];
  
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
  
  //~ console.log('setups.length ='+setups.length);
  
  for(var i = 0; i < setups.length; i++) {
    var setup = setups[i];
    
    if(setup && setup.init && typeof setup.init === 'function') {
     
      setup.init(bonobo, function(err, message) {
        var msgs = message;
        
        if(typeof message == "string") {
          msgs = [message];
        }
      //~ 
        //~ console.log('setup messages:');
        //~ for(var idx in msgs) {
          //~ console.log(msgs[idx]);
        //~ }
                //~ 
        if(i >= setups.length -1) {
          
          //this returns to the base setup route in ./base/routes/setup and shows the setup view
          cb(err, messages);
        }
      });
    }
  }
}


bonobo.DoThemModels = function() {
  
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
}

bonobo.RouteThemAll = function(cb) {
 
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
       
        if(doneI >= utils.getObjectLength( bonobo.plugins) ) {
          //~ console.log('plugin setuproutes doneI ='+doneI+" bonobo.plugins.length = "+utils.getObjectLength(bonobo.plugins));
        
               
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
  
  mongoose.model("Setting").findOne({slug: utils.slugify(pluginSettings.name.value)}, function(err, setting) {
    
    if(!setting) {
      pluginSettings.save(function(err,msg) {
        cb(err, "pluginSettings saved to db for first time");
      });
    }else{
      setting.update({$set: {opts: pluginSettings.opts.value}},function(err) {
        cb(err, "pluginSettings updated in the db.");
      });
    }
    
  });
  
}
