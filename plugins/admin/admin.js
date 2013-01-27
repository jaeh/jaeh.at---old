"use strict";

var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , path = require('path');

var admin = module.exports;
 

admin.routes = {};
admin.rootDir = __dirname;
 
admin.init = function(bonobo, cb) {
   
  
  bonobo.modelPaths.push(path.join(admin.rootDir, 'models'));
  
  //~ adminConfig.configure(base);
  
  cb(null, admin);
}

admin.setupRoutes = function(bonobo) {
    
  bonobo.reqs.gets.push({url: '/admin', route: function() {res.render('admin') }});
  
  for( var idx in bonobo.plugins ) {
    console.log('plugin =');
    console.log(bonobo.plugins[idx]);
    //~ 
    //~ bonobo.reqs.gets.push({url: '/admin/'+bonobo.plugins[idx].name, 
  }
}
