"use strict";

//bonobo does his thing. he goes through all the plugin directories and gets all models and all setup functions from there,
//he also can execute them.

var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , base = require(__dirname + '/base/base');

var bonobo = module.exports;



bonobo.init = function(rootDir){
    
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
  
  fs.readdirSync(rootDir).forEach(function (pluginName) {
    
    //load and init plugins
    var filename = path.join(rootDir, pluginName, pluginName);
    
    bonobo.plugins[pluginName] = require(filename).init(bonobo);
  });

  return bonobo;
}

bonobo.DoTheSetup = function() {
  for(var idx in bonobo.plugins) {
    
    var setup = require(path.join(bonobo.plugins[idx].rootDir, 'setup'));
    
    
    if(setup && setup.init && typeof setup.init === 'function') {
    
      setup.init();
    }
  }
  
  return "bonobo setup finished";
}

bonobo.DoYourThing = function() {
  
  base.modelPaths.push(path.join(base.rootDir, '/models'));
  
  for(var idx in bonobo.modelPaths) {
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
  

  //load and setup routes
  base.routes.pages = require(path.join(base.rootDir, '/routes/page')).page;
  base.routes.setup = require(path.join(base.rootDir, '/routes/setup')).setup;
  
  for(var pluginName in bonobo.plugins) {
    var plugin = bonobo.plugins[pluginName]
    
    if(plugin && plugin.setupRoutes && typeof plugin.setupRoutes === "function") {
      plugin.setupRoutes(bonobo);
    }
    
  }
  // setup page requests

  var PageData = mongoose.model('PageData');
  //~ 
  //~ var test = PageData.find().exec(function(err,p) {
    //~ for(var x in p) {
      //~ console.log('p['+x+'].meta.mIs.header =');
      //~ console.log(p[x].meta.mIs.header);
    //~ }
  //~ });
  
  PageData
  .findOne()
  .exec(function(err, pageData) {      
    
    base.locals.pageData = pageData;
    
    if(!pageData ) {
     //~ redirect to the setup page
      
     base.get('/', base.routes.setup);
       
     return;
    }
    
    base.gets = [];
    base.posts = [];
    
    base.gets.push({ url: '/', route: base.routes.pages});

    base.gets.push({ url: '/setup', route: base.routes.setup});
      
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
        base.get(getter.url, getter.route);
      }
    }

    for(var idx in base.posters){
      var poster = base.posters[idx];
      if(poster.url && poster.route) {
        base.post(poster.url, poster.route);
      }
    }    
  });
}
