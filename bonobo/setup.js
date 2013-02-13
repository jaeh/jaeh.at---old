"use strict";

var path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , bonobo = require(path.join(__dirname, 'bonobo'))
  , utils = require(path.join(__dirname, '..', 'base', 'utils'));
  
  
exports.init = function(bonobo){
  
  bonobo.DoTheSetup = function(cb) {
    
    var errs = []
      , msgs = []
      , setups = []
      , i = 0;
    
    //execute the setupscript for each plugin
    for(var idx in bonobo.plugins) {
      var setupDir = path.join(bonobo.plugins[idx].rootDir, 'setup.js');
      
      if(fs.existsSync(setupDir) ){
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
            
            if(err) utils.each(err, function(err){errs.push(err);});
            if(msg) utils.each(msg, function(msg){msgs.push(msg);});
            
            if(!setting){
              errs.push({message: "setup of a plugin has been called but the plugin seems to have no settings.js file", css: 'fail'});
              i++;
              if(i >= utils.count(setups)) cb(errs,msgs);
              return;
            }
            
            if( typeof setup.setup !== "function" ){
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

  
  
  
  bonobo.AddMenuItem = function(mI, cb) {
    var errs = []
      , msgs = [];
      
    var MenuItem = mongoose.model('MenuItem');
    
    
    MenuItem.findOne({'values.slug': utils.slugify(mI.text)}, function(err, menuItem){
      if(err) errs.push({message: err, css: "fail"});
      
      menuItem = menuItem || new MenuItem();
      
      menuItem.values = mI;
      
      menuItem.save(function(err, msg) {
                
        if(!err) {      
          msgs.push({message: 'menuItem '+menuItem.values.text+' save successful', css: 'win'});
        } else {
          errs.push({message: 'menuItem '+menuItem.values.text+' save errored: '+err, css: 'fail'});
        }
        
        cb(errs, msgs, menuItem);
        
      });
    });
  }
  
  bonobo.AddPluginMenuItems = function(mIs) {
    var mIList = {};
    
    utils.each(mIs.value, function(mI) {
    
      mIList[mI.key] = {};
      
      utils.each(mI.value.value, function(mIVal) {
        mIList[mI.key][mIVal.key] = mIVal.value.value;
      });
    });
    
    utils.each(mIList, function(mI) {
      bonobo.AddMenuItem(mI.value, function(err, msg){});
    });
  }
}
