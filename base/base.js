"use strict";

var express = require('express')
  , fs = require('fs')
  //~ , models = require('./models')
  , mongoose = require('mongoose')
  , baseConfig = require('./config')
  , path = require('path');

var base = module.exports = express();


base.init = function(viewRootDir) {

  base.rootDir = __dirname;

  baseConfig.configure(base, viewRootDir);

  return base;
}
