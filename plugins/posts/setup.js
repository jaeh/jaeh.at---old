"use strict";

var mongoose  = require('mongoose')
  , base = require(__dirname + '/../../base/base');


var setup = module.exports;

setup.init = function(cb) {
  console.log('initing posts setup');
  
  var Post = mongoose.model('Post');
 
  Post.findOne().exec(function(err, post) {
    
    if(!post) {
          
      console.log('no post found, will setup posts plugin now.');
    
      updatePageData();
    
      var Post = mongoose.model('Post');
      
      var numOfPosts = 20;
      
      var doneI = 0;
      
      for(var i = 0; i <= numOfPosts; i++) {
        
        var post = new Post();
        post.title = 'post '+i+' title';
        post.slug = 'post'+i+'title';
        post.body = 'post '+i+' body';
        post.footer = 'post '+i+' footer';
        
        post.save(function(err) {
                
          if( doneI >= numOfPosts) {
            console.log('posts setup complete');
            
            var message = "posts setup complete";
            console.log('post save completed with err '+err+" and message: "+message);
            cb(err, message);
          }
          doneI++;
        });
      }
    }
  });
  
}


function updatePageData() {
  
  var pageData = base.locals.pageData;
  
  var meta = pageData.meta;
  
  meta.mIs.header.push({ url: "/posts", text: "posts", order: 1});
  
  console.log(pageData);
  
  if(pageData) {
    pageData.update({meta: meta}, function(err, res) {
      if(err) throw err;
      
      console.log('err = '+err+' res ='+res);
    });
  }
}
