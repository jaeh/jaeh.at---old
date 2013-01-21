"use strict";

var express = require('express')
  , mongoose = require('mongoose')
  , hbs = require('hbs')
  , fs = require('fs')
  , path = require('path');
    

exports.configure = function(app){
  
  //~ hbs.registerPartial('partial', fs.readFileSync(path.join(app.libdir, '/views/partial.hbs'), 'utf8'));
  
  app.configure(function() {
    app.set('views', path.join(app.libdir, './views'));
    
    app.use(express.favicon(path.join(app.libdir, '/public/images/favicon.ico')));
    
    app.use(require('stylus').middleware(path.join(app.libdir, 'public')));
    
    app.use(express.static(path.join(app.libdir, 'public')));
    app.use(express.static(path.join(app.libdir, 'uploads')));
    
  });

}
