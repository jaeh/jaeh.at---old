"use strict";


var mongoose = require('mongoose')
  , User = mongoose.model("User");


var login = module.exports = {
  gets: {},
  posts: {}
}

login.gets.login = function(req, res) {
  res.render('auth/login');
}


login.posts.login = function(req, res) {
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
