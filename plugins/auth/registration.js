"use strict";

var express   = require('express')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , path      = require('path');

var registration = module.exports;
 
registration.init = function(bonobo) {
  
  registration.rootDir = __dirname; 
  //~ 
  
  //~ authConfig.configure(base);
  
  return registration;
}



registration.setupRoutes = function(bonobo) {
  
  var User              = mongoose.model("User")
    , UserRegistration  = mongoose.model("UserRegistration");
  
  var routes = require(path.join(registration.rootDir, 'routes/registration'));
  
  bonobo.reqs.gets.push({
    url:    '/registration', 
    route:  function(req,res) { res.render('auth/registration');}
  });
  
  bonobo.reqs.gets.push({
    url:    '/registration/confirm',
    route:  function(req, res) { res.render('auth/registration/confirm');}
  });
  
  bonobo.reqs.gets.push({
    url:    '/registration/confirm/:code',
    route:  function(req, res) { res.render('auth/registration/confirm');}
  });
  
  
  bonobo.reqs.posts.push({
    url: '/registration',
    route: routes.posts.registration
  });
  
  
  bonobo.reqs.posts.push({
    url:    '/registration/confirm',
    route:  routes.posts.registrationConfirm
  });
  
  bonobo.reqs.posts.push({
    url:    '/registration/confirm/:code',
    route:  routes.posts.registrationConfirm
  });
  
}
