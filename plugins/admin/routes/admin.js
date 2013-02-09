"use strict";


var mongoose = require('mongoose')
  , Post = mongoose.model("Post")
  , path = require('path')
  , adminApp = require(path.join(__dirname, '../admin'));

var routes = module.exports = {};

routes.admin = function(req, res, next) {
  res.render('admin/admin');
}

routes.options = function(req, res, next) {
    
  res.render('admin/settings');
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
