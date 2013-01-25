"use strict";

//bonobo does his thing. he goes through all the plugin directories and gets all models and all setup functions from there,
//he also can execute them.

var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , base = require(path.join(__dirname,'base/base'))
  , server = require(path.join(__dirname, 'server')); 

var bonobo = module.exports;

bonobo.init = function(rootDir, cb){
  console.log('bonobo init called');
  bonobo.rootDir = __dirname;
  bonobo.pluginDir = rootDir;
  
  //plugin object that holds the plugins
  bonobo.plugins = {};
  
  //will be added to to enable models in plugins
  bonobo.modelPaths = [];
  
  
  //reqs holds the http requests the plugins register
  bonobo.reqs = {};
  bonobo.reqs.gets = [];
  bonobo.reqs.posts = [];
  
  var readDirs = fs.readdirSync(rootDir);
  
  //load and init plugins
  for(var i = 0; i < readDirs.length; i++) {
    
    var pluginName = readDirs[i];
    
    var filename = path.join(rootDir, pluginName, pluginName);
    
    require(filename).init(bonobo, function(err, plugin) {
      //~ console.log('initing '+pluginName+" err ="+err);
      bonobo.plugins[pluginName] = plugin;
      
      if(i >= readDirs.length -1) {
        cb(bonobo);
      }
    });
  }
}

var messages = [];
  
bonobo.DoTheSetup = function(cb) {
  
  console.log('bonobo.plugins length='+server.utils.getObjectLength(bonobo.plugins)+" object=");
  //~ console.log(bonobo.plugins );
  
  var setups = [];
  
  //execute the setupscript for each plugin
  for(var idx in bonobo.plugins) {
    
    var setup = require(path.join(bonobo.plugins[idx].rootDir, 'setup'));
        
      console.log('setup = ');
      console.log(setup);
    //only if exists and executable
    if(setup && setup.init && typeof setup.init === 'function') {
      console.log('adding '+setup+" to setups");
      setups.push(setup);
    }
  }
  
  console.log('setups.length ='+setups.length);
  
  for(var i = 0; i < setups.length; i++) {
    var setup = setups[i];
    
    if(setup && setup.init && typeof setup.init === 'function') {
      console.log('setting up ');
      console.log(setup);
      
      setup.init(function(err, message) {
        var msgs = message;
        
        if(typeof message == "string") {
          msgs = [message];
        }
      
        for(var idx in msgs) {
          messages.push(message);
        }
        
        console.log('setups.length ='+setups.length);
        
        if(i >= setups.length -1) {
          console.log('bonobo.dothesetup calling back with err='+err+' and message =');
          //~ console.log(messages);
          cb(err, messages);
        }
      });
    }
  }
}

function doSetup(setup, callback) {
  //only if exists and executable
  if(setup && setup.init && typeof setup.init === 'function') {
    setup.init(callback(idx));
  }
}

bonobo.DoThemModels = function() {
   
  base.modelPaths.push(path.join(base.rootDir, '/models'));
  
  for(var idx in bonobo.modelPaths) {
    //~ console.log('bonobo.modelPaths['+idx+'] '+bonobo.modelPaths[idx]);
    base.modelPaths.push(bonobo.modelPaths[idx]);
  }
  
  // load and setup models from all plugins
  for(var idx in base.modelPaths) {
    
    var p = base.modelPaths[idx];
    
    //load every file found in every modelpath dir
    fs.readdirSync(p).forEach(function (file) {
      //~ console.log('enabling model '+path.join(p, file));
      require(path.join(p, file));
    });
  }
}

bonobo.RouteThemAll = function() {
 
  //first handle errors:
  //load and setup routes
  base.routes.pages = require(path.join(base.rootDir, '/routes/page')).page;
  base.routes.setup = require(path.join(base.rootDir, '/routes/setup'));
  
  if( !base.locals.pageData ) {
   //~ setup post and get for the setup page. settings can be changed later using the admin module
    base.get('/setup', base.routes.setup.gets.setup);
    base.post('/setup', base.routes.setup.posts.setup);
  }
  
  for(var pluginName in bonobo.plugins) {
    var pl = bonobo.plugins[pluginName]
    
    if(pl && pl.setupRoutes && typeof pl.setupRoutes === "function") {
      pl.setupRoutes(bonobo);
    }
    
  }
  // setup page requests

  base.gets = [];
  base.posts = [];
  
  base.gets.push({ url: '/', route: base.routes.pages});
    
  //get the requests from the plugins and add them to the base requests
  for(var fIdx in bonobo.reqs) {
    var reqs = bonobo.reqs[fIdx];

    for(var idx in reqs){
      var fE = reqs[idx];
      if(fE.url && fE.route){
        base[fIdx].push(fE);
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
}
