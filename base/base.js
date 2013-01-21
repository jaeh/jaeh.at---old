"use strict";

var express = require('express')
  , fs = require('fs')
  //~ , models = require('./models')
  , mongoose = require('mongoose')
  , config = require('./config')
  , path = require('path');

var base = module.exports = express();

base.init = function() {
  base.rootdir = __dirname;

  config.configure(base);

  base.routes = {};
  
  base.modelPaths = [];

  return base;
}

base.setupModels = function() {
  console.log('base.setupModels()');
  
  base.modelPaths.push(path.join(base.rootdir, '/models'));
  
  // Bootstrap models
  for(var idx in base.modelPaths) {
    var p = base.modelPaths[idx];
    fs.readdirSync(p).forEach(function (file) {
      console.log('enabling model '+path.join(p, file));
      require(path.join(p, file));
    });
  }
}

base.setupRoutes = function() {
  
  base.routes.pages = require(path.join(base.rootdir, '/routes/page')).page;
  base.routes.setup = require(path.join(base.rootdir, '/routes/setup')).setup;
}

//~ setup setters and getters for the whole app here,
//~ this hook will be called after all plugins have registered into the plugins object
base.afterPlugins = function() {
  
  if(base) {
    
    
    base.get('/', base.routes.pages);
    base.get('/setup', base.routes.setup);
    
    base.get('/:page', base.routes.pages);
  
  //~ if(base && base.plugins) {
    //~ for(var idx in base.getters) {
      //~ base.get(base.getters.url, base.getters.route);
    //~ }
  //~ 
    //~ for(var idx in base.posters){
      //~ base.post(base.posters[idx].url, base.posters[idx].route);
    //~ }
  }
}
