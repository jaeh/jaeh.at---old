"use strict";


var mongoose = require('mongoose')
  , User = mongoose.model("User");

exports.login = function(req, res, id) {
  
  res.render('auth/login');
}



  //~ Post
  //~ .find({}).limit(10).sort("-createdAt")
  //~ .exec(function(err, posts) {
    //~ 
    //~ res.render('posts/posts', {posts: posts});
    //~ return;
    //~ 
  //~ });	
