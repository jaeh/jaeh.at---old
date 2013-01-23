"use strict";

var express = require('express')
  , mongoose = require('mongoose')
  , hbs = require('hbs')
  , fs = require('fs')
  , path = require('path');
    

exports.configure = function(base, viewRootDir) {
  
  //~ hbs.registerPartial('partial', fs.readFileSync(path.join(base.basedir, '/views/partial.hbs'), 'utf8'));
  
  base.configure(function() {
    
    base.set('port', process.env.PORT || 3000);
    
    base.set('view engine', 'hbs');
    
    base.set('views', path.join(viewRootDir, '/views'));    
    
    base.use(express.logger('dev'));
    base.use(express.bodyParser());
    base.use(express.methodOverride());
    base.use(base.router);
    
    base.use(express.favicon(path.join(base.rootDir, '/public/images/favicon.ico')));
    
    base.use(require('stylus').middleware(path.join(base.rootDir, 'public')));
    
    base.use(express.static(path.join(base.rootDir, 'public')));
    
    
    base.modelPaths = [];
    
  });

}
