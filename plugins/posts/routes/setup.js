"use strict";

var mongoose  = require('mongoose')
  , Post      = mongoose.model('Post')
  , PageData  = mongoose.model('PageData');


exports.setup = function(req, res) {
  
  console.log('called posts setup');
  var setupstring = "setup was done already";
  Post.findOne().exec(function(err, post) {
    if(!post) {
      createPosts();
      updatePageData();
      setupstring = "setup successfull";
    }
  });
  
  res.render('posts/setup', {setupstring: setupstring});
}

function createPosts() {
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
  PageData.findOne().sort('createdAt').exec(function(err,pageData) {
    if(pageData) {
      var meta = pageData.meta;
      meta.mIs.header.push({ url: "/posts", text: "posts", order: 1});
      
      pageData.update( {meta: meta}, function(er, s) {
        if(err) throw err;
      });
    }
  });
}
