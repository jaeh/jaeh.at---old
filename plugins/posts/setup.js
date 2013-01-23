"use strict";

var mongoose  = require('mongoose')
  , base = require(__dirname + '/../../base/base');


var setup = module.exports;

setup.init = function() {
  console.log('initing posts setup');
  
  var Post = mongoose.model('Post');
 
  Post.findOne().exec(function(err, post) {
    
    if(!post) {
          
      console.log('no post found, will setup posts plugin now.');
      createPosts();
      updatePageData();
    }
  });
  
}

function createPosts() {
  
  var Post = mongoose.model('Post');
  
  for(var i = 0; i < 20; i++) {
    
    var post = new Post();
    post.title = 'post '+i+' title';
    post.slug = 'post'+i+'title';
    post.body = 'post '+i+' body';
    post.footer = 'post '+i+' footer';
    post.save();
  }
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
