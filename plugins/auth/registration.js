"use strict";

var express   = require('express')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , path      = require('path');

var registration = module.exports;
 
registration.init = function(bonobo) {
  
  registration.rootDir = __dirname; 
  
  
  return registration;
}



registration.setupRoutes = function(auth, cb) {
  
  var routes = require(path.join(registration.rootDir, 'routes/registration'));
  
  auth.reqs.gets.push({
    url:    '/registration', 
    route:  function(req,res) { res.render('auth/registration');}
  });
  
  auth.reqs.gets.push({
    url:    '/registration/confirm',
    route:  function(req, res) { res.render('auth/registration/confirm');}
  });
  
  auth.reqs.gets.push({
    url:    '/registration/confirm/:code',
    route:  function(req, res) { res.render('auth/registration/confirm');}
  });
  
  
  auth.reqs.posts.push({
    url: '/registration',
    route: routes.posts.registration
  });
  
  
  auth.reqs.posts.push({
    url:    '/registration/confirm',
    route:  routes.posts.registrationConfirm
  });
  
  auth.reqs.posts.push({
    url:    '/registration/confirm/:code',
    route:  routes.posts.registrationConfirm
  });
  
  cb();
}

