"use strict";

var express = require('express')
  , mongoose = require('mongoose')
  , path = require('path');

var opengraphdata = module.exports = {
    pluginName: "opengraphdata"
  , version:    "0.0.1"
  , rootDir:    __dirname
  , modelPaths: []
};
 
 
opengraphdata.init = function(bonobo, cb) {
  
  opengraphdata.modelPaths.push(path.join(opengraphdata.rootDir, 'models/'));
  
  bonobo.middleWare.push(getGraphData);
  
  cb(null, opengraphdata);
}

function getGraphData( req,res, next) {
  
  var OpenGraphData = mongoose.model('OpenGraphData');
  
  console.log('request in opengraphdata: ');
  console.log(req);
  
  
  cb();
}
