"use strict";


var mongoose = require('mongoose')
  , path = require('path')
  , utils = require(path.join(__dirname, '..', '..', '..', 'base', 'utils'));
  
  
var routes = module.exports = {


  admin: function(req, res, next) {
    res.render('admin/admin');
  }
  ,
  
  plugins: function(req, res, next) {
      
    var Setting = mongoose.model('Setting');
    
    Setting.find({/*'values.published.value': true*/}, function(err, settings) {
      var opts = []
        , i = 0;
      
      utils.deprecated_each(settings, function(opt) {
        
        if(opt.value.values) {
          opts.push(opt.value.values);
        }
        
        i++;
        
        if(i >= utils.count(settings)) {
        
          res.render('admin/plugins', {settings: opts});
      
        }
      
      });
      
    });
  }
  ,
  pluginSettings: function(req, res, next) {
      
    var Setting = mongoose.model('Setting');
    
    Setting.findOne({'slug': req.params.pluginSlug}, function(err, setting) {
      var opts = {value: {}}
        , i = 0;
            
      opts.key = setting.slug;
      opts.value.value = setting.values;
      
      res.render('admin/pluginSettings', {setting: opts});
  
    });
  }
  ,
  
  users: function(req,res,next) {
    
    var User = mongoose.model('User');
    
    User.find({},function(err, users){
      
      res.render('admin/users', {users: users});
      
    });
  } 
  ,
  
  userdetails: function(req,res,next) {
    
    var User = mongoose.model('User');
    
    User.find({},function(err, users){
      
      res.render('admin/userdetails', {users: users});
      
    });
  }
};
