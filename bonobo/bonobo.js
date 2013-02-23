"use strict";

//bonobo does his thing. he goes through all the plugin directories and gets all models and all setup functions from there,
//he also can execute them.

var path            = require('path')
  , fs              = require('fs')
  , mongoose        = require('mongoose')
  , utils           = require(path.join(__dirname, '..', 'base', 'utils'))
  , server          = require(path.join(__dirname, '..', 'server'))
  , setup           = require(path.join(__dirname, 'setup'))
  , middleware      = require(path.join(__dirname, 'middleware'))
  , models          = require(path.join(__dirname, 'models'))
  , routes          = require(path.join(__dirname, 'routes'))
  , pluginsettings  = require(path.join(__dirname, 'pluginsettings'))
  , menuitems       = require(path.join(__dirname, 'menuitems'));


var bonobo = module.exports = {
  
    rootDir : __dirname
  
  , plugins : {}    //plugin object that holds the plugins
  
  , modelPaths : [] //
  
  , middleWare: []  //these will be used in base.config to setup middleware for the various plugins
  
  , reqs : {        //reqs holds the http requests for all plugins
        gets: []    //http get requests
      , posts: []   //http post requests
    }
};

bonobo.init = function(rootDir, cb) {
  
  
  bonobo.pluginDir = rootDir;
  
  var readDirs = fs.readdirSync(rootDir);
  
  models.init(bonobo);
        
  var errs = []
    , msgs = []
    , i = 0;
    
  //load and init plugins
  for(var idx in readDirs) {
    
    var pluginName = readDirs[i];
    
    var filename = path.join(rootDir, pluginName);
    
    require(filename).init(bonobo, function(err, plugin) {
      if(err) errs.push({message: err, css: 'fail'});
      
      if(!err) msgs.push({message: 'initing '+pluginName+' plugin success', css: 'win'});
      
      bonobo.plugins[pluginName] = plugin;
      
      i++;
      if(i >= utils.count(readDirs) ) {
        
        setup.init(bonobo); //starts the setup of the base and the plugins that request autosetup
        routes.init(bonobo); //sets the routes for the application
        middleware.init(bonobo); //adds middleware from plugins
        pluginsettings.init(bonobo); // gets and sets pluginsettings
        menuitems.init(bonobo); //gets and sets menuitems
        
        
        cb(null, msgs);
      }
    });
  }
}
