"use strict";


var mongoose = require('mongoose')
  , path = require('path')
  , adminApp = require(path.join(__dirname, '../admin'))
  , utils = require(path.join(__dirname, '..', '..', '..', 'base', 'utils'));

var routes = module.exports = {};

routes.admin = function(req, res, next) {
  res.render('admin/admin');
}

routes.settings = function(req, res, next) {
    
  var Setting = mongoose.model('Setting');
  
  Setting.find({/*'values.published.value': true*/}, function(err, settings) {
    var opts = []
      , i = 0;
    
    utils.each(settings, function(opt) {
      
      if(opt.value.values){
       
        opts.push(opt.value.values);
      }
      
      i++;
      
      if(i >= utils.count(settings)) {
      
        res.render('admin/settings', {settings: opts});
    
      }
    
    });
    
  });
}

routes.pluginOptions = function(req,res,next) {

  var pluginSlug = req.params.pluginSlug;
  
  var Setting = mongoose.model('Setting');
  
  Setting.findOne({slug: pluginSlug}).exec(function(err, setting) {
    //~ console.log('settings for plugin '+pluginSlug);
    //~ console.log(setting);
    
    res.render('admin/pluginSettings', {settings: setting});
  }); 
}
