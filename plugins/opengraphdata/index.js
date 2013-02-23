"use strict";

var express = require('express')
  , mongoose = require('mongoose')
  , path = require('path');

var opengraphdata = module.exports = {
    pluginName: "opengraphdata"
  , version:    "0.0.1"
  , rootDir:    __dirname
};
 
 
opengraphdata.init = function(bonobo, cb) {
  
  bonobo.middleWare.push(getGraphData);
  
  cb(null, opengraphdata);
}

function getGraphData( req,res, next) {
  
  var OpenGraphData = mongoose.model('OpenGraphData');
  
  console.log('request in opengraphdata: ');
  console.log(req);
  
  cb();
}
