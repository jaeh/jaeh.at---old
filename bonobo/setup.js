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
    
    utils.each(setups, function(key, setup) {
      
      //~ console.log('setup =');
      //~ console.log(setup);
      
      if(setup.init && typeof setup.init === 'function') {
       
        setup.init(function(settings) {
      
          bonobo.getPluginSettings(settings, function(err, msg, setting) {
            errs = utils.getErrs(errs,err);
            msgs = utils.getMsgs(msgs,msg);
            
            if(!setting || !setting.values) {
              errs.push({message: "setup of a plugin has been called but the plugin seems to have no settings.js file", css: 'fail'});
              i++;
              if(i >= utils.count(setups)) cb(errs,msgs);
              return;
            }
            
            
            if(!setting.values.autoSetup || !setting.values.autoSetup.value) {
              
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
              
              
            setup.setup(function(err, msg) {
              errs = utils.getErrs(errs,err);
              msgs = utils.getMsgs(msgs,msg);
            
              msgs.push({message: "setup of the "+setting.values.name.value+" plugin has been completed", css: 'win'});
              
              setting.values.setupDone = true;
              
              if(setting.values.mIs && utils.count(setting.values.mIs) > 0 ) {
                bonobo.addPluginMenuItems(setting.values.mIs);
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
