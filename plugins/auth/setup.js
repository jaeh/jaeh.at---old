"use strict";

var mongoose  = require('mongoose')
  , base = require(__dirname + '/../../base/base');


var setup = module.exports;

setup.init = function(bonobo, cb) {
  
  console.log('initing auth setup');

  updatePageData();

  cb(null, "auth setup completed");
}

function updatePageData() {
  
  var pageData = base.locals.pageData;
  
  var meta = pageData.meta;
  
  meta.mIs.header.push({ url: "/registration", text: "registration", order: 5 });
  meta.mIs.header.push({ url: "/login", text: "login", order: 4 });
    
  if(pageData) {
    pageData.update({meta: meta}, function(err, res) {
      if(err) throw err;
    });
  }
}
