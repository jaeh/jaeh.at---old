"use strict";


var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , utils = require(path.join(__dirname, '..', 'base', 'utils'))
  , server = require(path.join(__dirname, '..', 'server'))
  , modelPaths = [];
  
  
exports.init = function(bonobo) { 
  
  
  bonobo.models = {};
  
  
  bonobo.DoThemModels = function(cb) {
    
    modelPaths.push(path.join(__dirname, '..', 'base', 'models'));
    
    utils.each(bonobo.plugins, function(k, plugin) {
      
      var p = path.join(plugin.rootDir, 'models');
      
      if(fs.existsSync(p)) {
        modelPaths.push(p);
      }
    });
      
    
    var errs = []
      , msgs = []
      , i = 0
      , j = 0
      , totalModels = 0;
      
    // load and setup models from all plugins
    utils.each(modelPaths, function(k, modelPath) {
      
      //load every file found in every modelpath dir
      var modelFiles = fs.readdirSync(modelPath);
      
      if(utils.count(modelFiles) > 0 ) {
        totalModels += utils.count(modelFiles);
      }
      
      i++;
      modelFiles.forEach(function (file) {
        
        require(path.join(modelPath, file)).init(function(err, msg, modelName, model) { //this actually loads and inits the models
                   
          errs = utils.getErrs(errs,err);
          msgs = utils.getMsgs(msgs,msg);
          
          bonobo.models[modelName] = model;
            
          j++;
          
          if(i >= utils.count(modelPaths) && j >= totalModels ) {
            
            if(utils.count(errs) <= 0) {
              msgs.push({message: 'bonobo initiated the models successfully', css: 'win'});
            }
                        
            cb(errs, msgs);
            
          }
        });
      });
    });
  }
}
