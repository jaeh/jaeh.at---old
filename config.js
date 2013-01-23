"use strict";

var express = require('express')
  , mongoose = require('mongoose')
  , hbs = require('hbs')
  , fs = require('fs')
  , path = require('path');
    

exports.configure = function(app){
  
  //~ hbs.registerPartial('partial', fs.readFileSync(path.join(app.rootDir, '/views/partial.hbs'), 'utf8'));
  
  app.set('view engine', 'hbs');
  
}
