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
        var setup = require(setupDir);
          
        
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
          
          if( !settings || utils.count(settings) < 1 ) {
            errs.push({message: "setup of a plugin has been called but the plugin seems to have no settings.js file", css: 'fail'});
            i++;
            if(i >= utils.count(setups)) cb(errs,msgs);
            return;
          }
          
          bonobo.getPluginSettings(settings, function(err, msg, setting) {
            errs = utils.getErrs(errs,err);
            msgs = utils.getMsgs(msgs,msg);
            
            setting = setting || {};
            
                        
            if(!setting.values) {
              setting.values = utils.settingsToMongo(settings);
            }
            
            if(!setting.values.autoSetup) {
              
              i++;
              if(i >= utils.count(setups)) cb(errs,msgs);
              return;
            }
              
            if( typeof setup.setup !== "function" ) {
              errs.push({message: setting.values.name +" setup had no setup function.", css: 'fail'});
              
              i++;
              if(i >= utils.count(setups)) cb(errs, msgs);
              return;
            }
              
              
            setup.setup(function(err, msg) {
              errs = utils.getErrs(errs,err);
              msgs = utils.getMsgs(msgs,msg);
            
              msgs.push({message: "setup of the "+setting.values.name+" plugin has been completed", css: 'win'});
              
              setting.values.setupDone = true;
              setting.values.published = true;
              
              
              if(setting.values.mIs && utils.count(setting.values.mIs) > 0 ) {
                
                utils.each(setting.values.mIs, function(k, val) {
                  
                  var mI = utils.settingsToMongo(val.value);
                  bonobo.addMenuItem(mI);
                });
              }
              
              bonobo.savePluginSettings(setting, function(err, msg, set) {
                errs = utils.getErrs(errs,err);
                msgs = utils.getMsgs(msgs,msg);
                  
                i++;
                if(i >= utils.count(setups)) cb(errs, msgs);
              });
            });
          });
        });
      }
    });
  }
}
