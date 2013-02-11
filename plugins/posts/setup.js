"use strict";

var mongoose  = require('mongoose')
  , path = require('path')
  , base = require(path.join(__dirname, '/../../base/base'))
  , utils = require(path.join(__dirname, '/../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));


var setup = module.exports = {};

var bonobo = {};

setup.init = function(cb) {
  cb(settings);
}

setup.setup = function(cb) {
  //~ console.log('will setup posts plugin now.');

  
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
