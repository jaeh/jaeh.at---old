"use strict";


var mongoose = require('mongoose')
  , Post = mongoose.model("Post");

exports.posts = function(req, res, id) {
  console.log('req.params =');
  console.log(id);

  Post
  .find({}).limit(10).sort("-createdAt")
  .exec(function(err, posts) {
    
    res.render('posts/posts', {posts: posts});
    return;
    
  });	
}
