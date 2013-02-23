"use strict";

var path = require('path')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , bonobo = require(path.join(__dirname, 'bonobo'))
  , utils = require(path.join(__dirname, '..', 'base', 'utils'));
  
  
exports.init = function(bonobo) {
   
  bonobo.addMenuItem = function(mI, cb) {
    var errs = []
      , msgs = [];
        
    if( !mI || typeof mI !== "object") {
      errs.push({message: "bonobo.addMenuItem needs a mI.values object to work", css: "fail"});
      console.log('bonobo.AddMenuItem(object menuItem, function callback) needs a mI object with a mI.values subobject to work');
      console.log(mI);
      cb(errs, msgs, false);
      return;
    }

    var MenuItem = mongoose.model('MenuItem');
    
    if(typeof mI.text === "object"){  //executes if we get an object from a settings.js file
      mI = utils.settingsToMongo(mI); //this will only work as long as menuitems are onedimensional.
    }
    
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
        if(typeof cb === "function") {
          cb(errs, msgs, menuItem);
        }
      });
    });
  }
}
