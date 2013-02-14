"use strict";


var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , utils = require(path.join(__dirname, '..', 'base', 'utils'))
  , server = require(path.join(__dirname, '..', 'server'));


exports.init = function(bonobo) {
  bonobo.DoTheMiddleWare = function(base, req, res, next) {
    var i = 0;
    
    utils.each(bonobo.middleWare, function(mW) {
      if(typeof mW === 'function') {
        base.use(mW);
      }
      
      i++;
      
      if(i >= utils.count(bonobo.middleWare)) {
        next();
      }
    });
  }
}
