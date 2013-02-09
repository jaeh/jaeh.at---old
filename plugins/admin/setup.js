"use strict";

var mongoose  = require('mongoose')
  , path = require('path')
  , base = require(path.join(__dirname, '/../../base/base'))
  , utils = require(path.join(__dirname, '/../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));


var setup = module.exports = {};

setup.init = function(bonobo, cb) {
  
  var errs = []
    , msgs = [];
  
  bonobo.getPluginSettings(settings, function(err, setting) {
    
    if(err) errs.push(err);
    
    if( !setting.opts.setupDone || !setting.opts.setupDone.value 
        || utils.getVersionNumber(settings.version.value) > utils.getVersionNumber(setting.opts.version.value)) {
      
      setupPlugin(function(err, msg) {
        if(err) errs.push(err);
        if(msg) msgs.push(msg);
        
        setting.opts.setupDone.value = true;
        
        bonobo.updateOrSavePluginSettings(setting, function(err){
          cb(err, settings.name.value+" setup has completed");
        });
      });          
    }else{
      cb(null, settings.name.value+" setup has been completed already, did nothing");
    }
  });
}


function setupPlugin(cb) {
  var errs = []
    , msgs = [];
    
  
  cb(null, null);
}
