"use strict";

var mongoose  = require('mongoose')
  , base = require(__dirname + '/../../base/base');


var setup = module.exports;

setup.init = function(cb) {
  console.log('initing auth setup');
  cb(null, "auth setup completed");
}
