"use strict";


var mongoose = require('mongoose')
  , path = require('path')
  , fs = require('fs')
  , server = require(path.join(__dirname, '..', '..', '..', 'server'))
  , utils = require(path.join(__dirname, '..', '..', '..', 'base', 'utils'))
  , Setting = mongoose.model('Setting')
  , bonobo = require(path.join(__dirname, '..','..','..', 'bonobo', 'bonobo'));
  
  
var routes = module.exports = {


  admin: function(req, res, next) {
    res.render('admin/admin');
  }
  ,
  plugins: function(req,res,next) {
    
    var pluginDir = path.join(server.rootDir, 'plugins')
      , pluginDirs = fs.readdirSync(pluginDir)
      , plugins = []
      , pluginSettings = {}
      , i = 0
      , msgs = []
      , errs = [];
    
    for(var k in pluginDirs) {
      plugins[pluginDirs[k]] = require(path.join(pluginDir, pluginDirs[k]));
      
      //~ pluginSlugs.push(pluginDirs[k]);
      //settings = require(path.join(plugin.rootDir, 'settings'));
      
        
      pluginSettings[pluginDirs[k]] = require(path.join(pluginDir, pluginDirs[k], 'settings'));
      
    }
    
    for(var k in pluginSettings) {
      
      bonobo.getPluginSettings(pluginSettings[k], function(err,msg,setting) {
        errs = utils.getErrs(errs,err);
        msgs = utils.getMsgs(msgs,msg);
        
        if(setting && setting.values) {
          pluginSettings[settings.name.value] = utils.MongoToJSON(settings, setting.values);
        }

        i++;
        
        if(i >= pluginDirs.length) {
          res.render('admin/plugins', {plugins: plugins, settings: pluginSettings});  
        }
      });
    }
  }
  ,
  plugins2: function(req, res, next) {
      
    var Setting = mongoose.model('Setting');
    
    Setting.find({/*'values.published.value': true*/}, function(err, settings) {
      var opts = []
        , i = 0;
      
      utils.each(settings, function(k, setting) {
        
        
        if(setting.values) {
          opts.push(setting.values);
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
    //var settings = require(path.join());
    console.log('req.params.pluginSlug ='+req.params.pluginSlug);
    
    var settings = require(path.join(server.rootDir, 'plugins', req.params.pluginSlug, 'settings')) || false;
    
    if(!settings) next();
    
    bonobo.getPluginSettings(settings, function(err, msg, setting) {
      if(setting && setting.values) {
        settings = utils.MongoToJSON(settings, setting.values);
      }
      
      var set = {
          key: settings.name.value
        , value: {
            value: settings
        }
      }
      
      res.render('admin/pluginSettings', {setting: set});
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
