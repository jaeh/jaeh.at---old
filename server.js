"use strict";

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs');

var server = module.exports;
server.rootDir = __dirname;

server.base = require(server.rootDir + "/base/base").init(server.rootDir);

//plugin management
server.bonobo = require('./bonobo').init(path.join(server.rootDir, 'plugins'));


//by now all plugins have registered the models and views, are setup and ready for the bonobo to start :)

server.bonobo.DoYourThing();
  
//setup the mongodb and the errorhandlers
server.base.configure('development', function(){
  server.base.use(express.errorHandler());
  
  // Bootstrap db connection
  mongoose.connect('dev:27017/232323232323232323232323');

});

//start the server.base server
if(server.base) {
  http.createServer(server.base).listen(server.base.get('port'), function(){
    console.log("Express server listening on port " + server.base.get('port'));
  });
}
