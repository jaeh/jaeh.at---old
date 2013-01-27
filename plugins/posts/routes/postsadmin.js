"use strict";


var mongoose = require('mongoose')
  , Post = mongoose.model("Post");

var routes = module.exports = {};

routes.postsadmin = function(req, res, next) {
  var queryObject = {};
  
  //~ console.log(query.count());
  Post.count({}, function(err, count) {
    if(err) next(err);
    
    Post
    .find({}).limit(20).sort("-createdAt")
    .exec(function(err, posts) {
      
      res.render('posts/admin/posts', {posts: posts, postCount: count});
      return;
    });	
  });
}


routes.postadmin = function(req, res, next) {
  if(!req.params || !req.params.slug) {
    res.redirect('/postsAdmin');
    return;
  }

  Post
  .findOne({slug: req.params.slug})
  .exec(function(err, post) {
    
    if(!post) {
      next();
      return;
    }
        
    res.render('posts/postAdmin', {post: post});
    return;
    
  });
}
