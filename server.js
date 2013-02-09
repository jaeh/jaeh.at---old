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
      , db: "fnord2"
    }
  , port: '3000'
  , 
}
server.utils = require(path.join(server.rootDir, "/base/utils"));

require(path.join(server.rootDir, "/base/base")).init(function(base) {

  //plugin management
  require('./bonobo').init(path.join(server.rootDir, 'plugins'), function(bonobo) {
      
    bonobo.DoThemModels(base, function() {

      base.config(server.rootDir, function() {

        //by now all plugins have registered the models and views, are setup and ready for the bonobo to start :)
        
        //setup the mongodb and the errorhandlers
        base.configure('development', function(){
          base.use(express.errorHandler());
          
          // Bootstrap db connection
          mongoose.connect(server.settings.mongodb.url+':'+server.settings.mongodb.port+'/'+server.settings.mongodb.db);

          bonobo.RouteThemAll(base, function(err){
              
            //start the base server
            if(base) {
              http.createServer(base).listen(base.get('port'), function(){
                console.log("Express server listening on port " + base.get('port'));
              });
            }
          });
        });          
      });
    });
  });
});

