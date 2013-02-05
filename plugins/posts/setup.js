"use strict";

var mongoose  = require('mongoose')
  , path = require('path')
  , base = require(path.join(__dirname, '/../../base/base'))
  , utils = require(path.join(__dirname, '/../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));


var setup = module.exports = {};

var bonobo = {};

setup.init = function(bonobo, cb) {
  bonobo.getPluginSettings(settings, function(err, setting) {
    //~ console.log('setting=');
    //~ console.log(setting);
    
    if( !setting.opts.setupDone || !setting.opts.setupDone.value 
        || utils.getVersionNumber(settings.version.value) > utils.getVersionNumber(setting.opts.version.value)) {
      setupPostsPlugin(function(err, msg) {
        
        setting.opts.setupDone.value = true;
        
        bonobo.updateOrSavePluginSettings(setting, function(err){
          cb(err, "posts setup has completed");
        });
        
      });
      
    }else{
      cb(null, "posts setup has been completed already, did nothing");
    }
  });
}


function updatePageData() {
  
  base.GetPageData(function(err, pageData) {
    
      var values = pageData.values;
      
      values.meta.mIs.header.push({ url: "/posts", text: "posts", order: 1});
      
      base.UpdatePageData(values, function(err, res) {
          if(err) throw err;
      });
  });
  
}


function setupPostsPlugin(cb) {
  console.log('will setup posts plugin now.');

  updatePageData();

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
