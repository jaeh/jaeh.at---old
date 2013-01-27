"use strict";

var express = require('express')
  , fs = require('fs')
  //~ , models = require('./models')
  , mongoose = require('mongoose')
  //~ , postsConfig = require('./config')
  , path = require('path');

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
  
  cb(null, posts);
}

posts.setupRoutes = function(bonobo) {
  
  //~ posts.routes.posts = require(path.join(base.rootDir, '/routes/page')).page
  posts.routes = require(path.join(posts.rootDir, '/routes/posts'));
  
  posts.reqs.gets.push({url: '/posts', route: posts.routes.posts});
  posts.reqs.gets.push({url: '/post/:slug', route: posts.routes.post});
  
}
