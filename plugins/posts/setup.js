"use strict";

var mongoose  = require('mongoose')
  , path = require('path')
  , base = require(path.join(__dirname, '/../../base/base'))
  , utils = require(path.join(__dirname, '/../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));


var setup = module.exports = {};

var bonobo = {};

setup.init = function(bonobo, cb) {
  var errs = []
    , msgs = []
    , i = 0;
    
    
  bonobo.getPluginSettings(settings, function(err, setting) {
    
    if(err) errs.push({message: err, css: 'fail'});
    
    if(  !setting.opts.setupDone 
      || !setting.opts.setupDone.value 
      || utils.getVersionNumber(settings.version.value) > utils.getVersionNumber(setting.opts.version.value)
      ) {
      
      setupPostsPlugin(function(errs, msgs) {
        
        setting.opts.setupDone.value = true;
        
        bonobo.updateOrSavePluginSettings(setting, function(errs, msgs){
          
          if(errs.length == 0) {
            msgs.push({message: 'posts setup successful', css: 'win'});
          }else{
            errs.push({message: 'posts setup completed with errors', css: 'fail'});
          }
          
          cb(errs, msgs);
        });
        
      });
      
    }else{
      msgs.push({message: "posts setup has been completed already, did nothing", css: 'meh'});
      
      cb(errs, msgs);
    }
  });
}


function AddMenuItems(cb, errs, msgs) {
  
}


function setupPostsPlugin(cb) {
  console.log('will setup posts plugin now.');

  
  var Post = mongoose.model('Post');
  
  var numOfPosts = 120;
  
  var doneI = 0;
  
  for(var i = 0; i <= numOfPosts; i++) {
    
    var post = new Post();
    post.title = 'post '+i+' title';
    
    post.body = 'post '+i+' body';
    post.footer = 'post '+i+' footer';
    post.createdAt = new Date();
    var minutes = post.createdAt.getMinutes();
    minutes += i;
    post.createdAt.setMinutes(minutes);
    
    //~ console.log('post.createdAt = '+post.createdAt);
    
    post.save(function(err) {
            
      if( doneI >= numOfPosts) {
        //~ console.log('posts setup complete');
        
        var message = "posts setup complete";
        //~ console.log('post save completed with err '+err+" and message: "+message);
        
        cb(null, "posts setup complete");
      }
      doneI++;
    });
  }
}
