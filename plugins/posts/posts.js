"use strict";

var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , path = require('path')
  , settings = require(path.join(__dirname, "settings"));

var posts = module.exports = {
    routes:   {}
  , rootDir:  __dirname
  , modelPaths: []
  , reqs: {
        gets:  []
      , posts: []
  }
};
 
posts.init = function(bonobo, cb) {
  
  posts.modelPaths.push(path.join(posts.rootDir, 'models/'));
  
  posts.admin = {};
  
  cb(null, posts);
}

posts.setupRoutes = function(bonobo, cb) {
  bonobo.getPluginSettings(settings, function(err, setting) {
    posts.settings = setting;
    
    posts.routes = require(path.join(posts.rootDir, '/routes/posts'));
    posts.admin.routes = require(path.join(posts.rootDir, '/routes/postsadmin'));
    
    posts.reqs.gets.push({url: '/posts', route: posts.routes.posts});
    posts.reqs.gets.push({url: '/posts/:pagination', route: posts.routes.posts});
    posts.reqs.gets.push({url: '/post/:slug', route: posts.routes.post});
    
    var adminExists = fs.existsSync(path.join(__dirname, "..", "admin"));
    
    //~ console.log('adminExists ='+adminExists);
    
    if(adminExists) {
      posts.reqs.gets.push({url: '/admin/posts', route: posts.admin.routes.postsadmin});
    }
    
    cb();
  });
}


