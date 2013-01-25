"use strict";

var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var auth = module.exports;
 
auth.init = function(bonobo, cb) {
  
  auth.rootDir = __dirname; 
  //~ 
  bonobo.modelPaths.push(path.join(auth.rootDir, 'models'));
  
  //~ authConfig.configure(base);
  
  
  passport.use(new LocalStrategy(
    {
      usernameField: 'name',
      passwordField: 'password'
    },
    function(name, password, done) {
      console.log('logging in useing name:'+name+" and pass: "+password);
        
      mongoose.model("User").findOne({ name: name, password: password }, function(err, user) {
        if (err) { return done(err); }
        
        var message = {};
        
        if (!user) {
          user = undefined;
          message.class = 'red';
          message.text = 'Incorrect username or password.';
        }
        
        //~ if (!user.validPassword(password)) {
          //~ return done(null, false, { message: 'Incorrect password.' });
        //~ }
        
        return done(null, user, message);
      });
    }
  ));
  
  passport.serializeUser(function(name, done) {
    done(null, name);
  });

  passport.deserializeUser(function(name, done) {
    mongoose.model("User").findOne({name: name}, function(err, user) {
      done(err, user);
    });
  });

  
  auth.registration = require(path.join(auth.rootDir, 'registration')).init(bonobo);
  
  cb(null, auth);
}

auth.setupRoutes = function(bonobo) {
    
  //~ auth.routes.auth = require(path.join(base.rootDir, '/routes/page')).page;
  
  //~ var loginRoutes = require(path.join(auth.rootDir, '/routes/login'));
  //~ var registrationRoutes = require(path.join(auth.rootDir, '/routes/registration'));
  //~ var resetPasswordRoutes = require(path.join(auth.rootDir, '/routes/resetPassword'));
  
  
  bonobo.reqs.gets.push({
    url:    '/login', 
    route:  function(req,res) { res.render('auth/login');}
  });
  
  bonobo.reqs.gets.push({
    url: '/logout', 
    route: function(req, res){ 
      req.logout();
      res.redirect('/');
    }
  });
  
  //~ bonobo.reqs.posts.push({
    //~ url:    '/login', 
    //~ route:  function(req,res) { res.render('auth/login');}
  //~ });
  
  bonobo.reqs.posts.push({
    url: '/login', 
    route: function(req,res,next) {
    
      passport.authenticate('local', function(err, user, info) {
      
        if (err) { return next(err) }

        if (!user) { return res.render('auth/login', {message: info}) }

        res.redirect('/account');

      })(req, res, next);
    }
  });
  
  //setup routes of subplugins
  auth.registration.setupRoutes(bonobo);
}


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
auth.ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
