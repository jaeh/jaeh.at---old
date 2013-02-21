"use strict";


var mongoose = require('mongoose')
  , path = require('path')
  , utils = require(path.join(__dirname, '..', '..', '..', 'base', 'utils'));
  
  
var routes = module.exports = {

  pluginSettings: function(req, res, next) {
      
    var reqBody = utils.requestBodyToJSON(req.body);

    var Setting = mongoose.model('Setting');
    
    Setting.findOne({'slug': req.params.pluginSlug}, function(err, setting) {
      var opts = {value: {}}
        , i = 0
        , errs = []
        , msgs = [];
      
      setting = setting || new Setting();
      
      setting.values = reqBody;
    
      opts.key = req.params.pluginSlug;
      opts.value.value = reqBody;
      
      
      setting.save(function(err) {
        if(err) errs.push({message: err, css: 'fail'});
        else msgs.push({message: 'Settings saved successfully', css: 'win'});
        
        res.render('admin/pluginSettings', {setting: opts, messages: msgs, errors: errs});
      });
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
