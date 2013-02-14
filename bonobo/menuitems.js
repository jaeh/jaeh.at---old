"use strict";

var path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , bonobo = require(path.join(__dirname, 'bonobo'))
  , utils = require(path.join(__dirname, '..', 'base', 'utils'));
  
  
exports.init = function(bonobo) {
   
  bonobo.AddMenuItem = function(mI, cb) {
    var errs = []
      , msgs = [];
      
    var MenuItem = mongoose.model('MenuItem');
    
    
    MenuItem.findOne({'values.slug': utils.slugify(mI.text)}, function(err, menuItem) {
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
      bonobo.AddMenuItem(mI.value, function(err, msg) {});
    });
  }
}
