"use strict";

var path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , bonobo = require(path.join(__dirname, 'bonobo'))
  , utils = require(path.join(__dirname, '..', 'base', 'utils'));
  
  
exports.init = function(bonobo) {
  
  bonobo.DoTheSetup = function(cb) {
    
    var errs = []
      , msgs = []
      , setups = []
      , i = 0;
    
    //execute the setupscript for each plugin
    for(var idx in bonobo.plugins) {
      var setupDir = path.join(bonobo.plugins[idx].rootDir, 'setup.js');
      
      if(fs.existsSync(setupDir) ) {
        var setup = require(path.join(bonobo.plugins[idx].rootDir, 'setup'));
          
        
        //only if exists and executable
        if(setup && setup.init && typeof setup.init === 'function') {
         
          setups.push(setup);
        }
      }
    }
    
    utils.each(setups, function(setUp) {
      var setup = setUp.value;
      
      if(setup && setup.init && typeof setup.init === 'function') {
       
        setup.init(function(settings) {
      
          bonobo.getPluginSettings(settings, function(err, msg, setting) {
            
            if(err) utils.each(err, function(err) {errs.push(err);});
            if(msg) utils.each(msg, function(msg) {msgs.push(msg);});
            
            if(!setting) {
              errs.push({message: "setup of a plugin has been called but the plugin seems to have no settings.js file", css: 'fail'});
              i++;
              if(i >= utils.count(setups)) cb(errs,msgs);
              return;
            }
            
            if( typeof setup.setup !== "function" ) {
              errs.push({message: settings.name.value +" setup had no setup function.", css: 'fail'});
              
              i++;
              if(i >= utils.count(setups)) cb(errs, msgs);
              return;
            }
              
              
            setup.setup(function(errs, msgs) {
              
              console.log('setting.slug =');
              console.log(setting);
              
              setting.values.setupDone.value = true;
              
              if(setting.values.mIs && utils.count(setting.values.mIs) > 0  ) {
                bonobo.AddPluginMenuItems(setting.values.mIs);
              }
              i++;
              if(i >= utils.count(setups)) cb(errs, msgs);

            });
          });
        });
      }
    });
  }
}
