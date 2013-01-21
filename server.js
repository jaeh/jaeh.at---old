"use strict";

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var base = require(__dirname + "/base/base").init();
  
//~ base.posts = require(__dirname + "/posts/posts").init();
  

base.setupModels();

base.setupRoutes();

base.afterPlugins();

base.configure('development', function(){
  base.use(express.errorHandler());
  
  // Bootstrap db connection
  mongoose.connect('dev:27017/qweqeqq')

});

if(base) {
  http.createServer(base).listen(base.get('port'), function(){
    console.log("Express server listening on port " + base.get('port'));
  });
}
