"use strict";

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs');

var server = module.exports;
server.rootDir = __dirname;


server.utils = require(path.join(server.rootDir, "/base/utils"));

server.base = require(path.join(server.rootDir, "/base/base")).init();


//plugin management
require('./bonobo').init(path.join(server.rootDir, 'plugins'), function(bonobo) {
  //~ 
  //~ console.log('server.js says bonobo init successfull, bonobo =');
  //~ console.log(bonobo);
    
  server.bonobo = bonobo;

  server.bonobo.DoThemModels();

  server.base.config(server.rootDir);

  //by now all plugins have registered the models and views, are setup and ready for the bonobo to start :)

  server.bonobo.RouteThemAll();
    
  //setup the mongodb and the errorhandlers
  server.base.configure('development', function(){
    server.base.use(express.errorHandler());
    
    // Bootstrap db connection
    mongoose.connect('dev:27017/testing');

  });

  //start the server.base server
  if(server.base) {
    http.createServer(server.base).listen(server.base.get('port'), function(){
      console.log("Express server listening on port " + server.base.get('port'));
    });
  }

});
