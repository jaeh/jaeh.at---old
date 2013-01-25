"use strict";

var express = require('express')
  , fs = require('fs')
  //~ , models = require('./models')
  , mongoose = require('mongoose')
  //~ , postsConfig = require('./config')
  , path = require('path');

var posts = module.exports;
 
posts.init = function(bonobo, cb) {
  
  posts.rootDir = __dirname; 
  
  bonobo.modelPaths.push(path.join(posts.rootDir, 'models'));
  
  //~ postsConfig.configure(base);
  
  cb(null, posts);
}

posts.setupRoutes = function(bonobo) {
  posts.routes = {};
  
  //~ posts.routes.posts = require(path.join(base.rootDir, '/routes/page')).page;
  posts.routes.setup = require(path.join(posts.rootDir, '/routes/setup')).setup;
  posts.routes.posts = require(path.join(posts.rootDir, '/routes/posts')).posts;
  
  bonobo.reqs.gets.push({url: '/posts', route: posts.routes.posts});
  bonobo.reqs.gets.push({url: '/posts/:id', route: posts.routes.posts});
  
  //~ console.log('bonobo.reqs.gets from posts:');
  //~ console.log(bonobo.reqs.gets);
  
}
