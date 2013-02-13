"use strict";

var mongoose  = require('mongoose')
  , path = require('path')
  , base = require(path.join(__dirname, '..','..', 'base/base'))
  , settings = require(path.join(__dirname, "settings"));


var setup = module.exports;

setup.init = function(cb) {
  
  cb(settings);
}

setup.setup = function(cb) {
  cb(null,null);
}
