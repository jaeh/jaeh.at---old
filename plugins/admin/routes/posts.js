"use strict";


var mongoose = require('mongoose')
  , path = require('path')
  , server = require(path.join(__dirname, '..','..','..', 'server'))
  , bonobo = require(path.join(__dirname, '..','..','..', 'bonobo','bonobo'))
  , utils = require(path.join(__dirname, '..', '..', '..', 'base', 'utils'));
  
  
var routes = module.exports = {

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
  userdetails: function(req,res,next) {
    
    var User = mongoose.model('User');
    
    User.find({},function(err, users){
      
      res.render('admin/userdetails', {users: users});
      
    });
  }
};
