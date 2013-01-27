"use strict";


var mongoose = require('mongoose')
  , User = mongoose.model("User")
  , Option = mongoose.model("PluginOptions")
  , auth = require('../auth');


var options = module.exports = {
  gets: {},
  posts: {}
}


options.gets.options = function(req, res) {
  console.log('finding option with plugin: '+auth.pluginName);
  
  Option.findOne({plugin: auth.pluginName}).exec(function(err, options) {
    var messages = [];
    
    console.log('options.get err = '+err+' options =');
    console.log(options);
    if(err) {
      messages.push({class:"red", text: err});
    }
    if(!options || err) {
      options = new Option();
      options.opt = auth.options;
      options.plugin = auth.pluginName;
      options.version = auth.version;
      options.save();
    }
    //~ console.log('options =');
    //~ console.log(options);
    
    res.render('admin/pluginOptions', {options: options, messages: messages});
    
  });
}


options.posts.options = function(req, res) {
  console.log('req.body =');
  console.log(req.body);
    
  Option.findOne({plugin: 'auth'}).exec(function(err, pluginOptions) {
    
    var options = pluginOptions || new Option();
    
    console.log('options =');
    console.log(options);
    
    var opt = [];
    for( var i = 0; i < auth.options.length; i++) {
      var option = auth.options[i];
      
      var val = req.body[option.name];
      if(val){
        //catches checkboxes
        if (val == "on"){
          val = true;
        }else if (val == "off") {
          val = false;
        }
        
        opt.push({
            name  : option.name
          , value : val
        });
      }
    }
    
    options.opt = opt;
    
    options.plugin = auth.pluginName;
    options.version = auth.version;

    Option.update({plugin: auth.pluginName}, {$set: {opt: options.opt}}, {upsert: true}, function(err, ret) {
       
      console.log('options after update: ');
      console.log();
      var messages = [];
      
      if(err) messages.push({class:'red', text: err});
      
      res.render('admin/pluginOptions', {options: options, messages: messages });
    });
  });
}
