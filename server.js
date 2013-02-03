"use strict";

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs');

var server = module.exports;

server.rootDir = __dirname;

server.settings = {
    mongodb: {
        url: '127.0.0.1'
      , port: "27017"
      , db: "fnord23"
    }
  , port: '3000'
  , 
}
server.utils = require(path.join(server.rootDir, "/base/utils"));

server.base = require(path.join(server.rootDir, "/base/base")).init();

//plugin management
require('./bonobo').init(path.join(server.rootDir, 'plugins'), function(bonobo) {
    
  server.bonobo = bonobo;

  server.bonobo.DoThemModels();

  server.base.config(server.rootDir);

  //by now all plugins have registered the models and views, are setup and ready for the bonobo to start :)
  
  //setup the mongodb and the errorhandlers
  server.base.configure('development', function(){
    server.base.use(express.errorHandler());
    
    // Bootstrap db connection
    mongoose.connect(server.settings.mongodb.url+':'+server.settings.mongodb.port+'/'+server.settings.mongodb.db);

  });

  server.bonobo.RouteThemAll(function(err){
      
    //start the server.base server
    if(server.base) {
      http.createServer(server.base).listen(server.base.get('port'), function(){
        console.log("Express server listening on port " + server.base.get('port'));
      });
    }
  });
});

