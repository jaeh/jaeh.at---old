"use strict";

var mongoose  = require('mongoose')
  , path = require('path')
  , base = require(path.join(__dirname, '/../../base/base'))
  , utils = require(path.join(__dirname, '/../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));


var setup = module.exports = {};

setup.init = function(bonobo, cb) {
  bonobo.getPluginSettings(settings, function(err, setting) {
    //~ console.log('setting=');
    //~ console.log(setting);
    
    if( !setting.opts.setupDone || !setting.opts.setupDone.value 
        || utils.getVersionNumber(settings.version.value) > utils.getVersionNumber(setting.opts.version.value)) {
      
      setupPlugin(function(err, msg) {
        
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


function updatePageData(cb) {
  
  var pageData = base.locals.pageData;
  
  var meta = pageData.meta;
  
  meta.mIs.header.push({ url: "/admin", text: "admin", order: 9});
  
  if(pageData) {
    pageData.update({meta: meta}, function(err, res) {
      
      cb(err);
    });
  }
}


function setupPlugin(cb) {
  updatePageData(function(err,msg) {
    cb(err,"");
  });
}
