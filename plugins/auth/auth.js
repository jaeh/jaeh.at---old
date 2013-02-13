"use strict";

var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , path = require('path')  
  , SHA512            = new(require('jshashes').SHA512)()
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , settings = require(path.join(__dirname, 'settings'));

var auth = module.exports = {
    SHA512SALT: 'changeThis'
  , pluginName: "auth"
  , version:    "0.0.1" 
  , rootDir:    __dirname
  , modelPaths: []
  , reqs: { gets: [], posts: [] }
};
 
 
auth.init = function(bonobo, cb) {
  //~ 
  auth.modelPaths.push(path.join(auth.rootDir, 'models'));
  
  //~ authConfig.configure(base);

  auth.registration = require(path.join(auth.rootDir, 'registration')).init(auth);
  
  cb(null, auth);
}

auth.setupRoutes = function(bonobo, cb) {
  
  
  //~ bonobo.getPluginSettings(settings, function(err, setting) {
  
    //~ auth.settings = setting;
  
    auth.reqs.gets.push({
      url:    '/login', 
      route:  function(req,res) { res.render('auth/login');}
    });
    
    auth.reqs.gets.push({
      url: '/logout', 
      route: function(req, res){ 
        req.logout();
        res.redirect('/');
      }
    });
    
    auth.reqs.posts.push({
      url: '/login', 
      route: function(req,res,next) {
      
        var loginObject = {
            name: req.body.name
          , password: req.body.password
        }
      
        mongoose.model('User').findOne(loginObject, function(err, user) {
       
          if (!user) { return res.render('auth/login', {message: info}) }

            
          if(user.password == req.body.password) {
              
            var userForLogin = {
              name: user.name,
              email: user.email,
              about: user.about
            }
            
            req.login(userForLogin, function(err) {
              if (err) return next(err);
              
              res.redirect('/user/'+userForLogin.name);

            });
          }
        });
      }
    });
    
   
    auth.reqs.gets.push({
        url: '/user/:user'
      , route: function(req,res){
        
          //~ console.log('req.params = ');
          //~ console.log(req.params);
          res.render('profile/user', {user: {name: "test", logo: 'logo'} });
        }
    });
    
    //setup routes of subplugins
    auth.registration.setupRoutes(auth, cb);
  //~ });
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



passport.use(new LocalStrategy(
  {
    usernameField: 'name',
    passwordField: 'password'
  },
  function(name, password, done) {
    
    //~ var password = SHA512.b64_hmac(password, auth.SHA512SALT);
    
    mongoose.model("User").findOne({ name: name }, function(err, user) {
      if (err) { return done(err); }
      
      console.log('logging in using name:'+name+" and pass: "+password);
      console.log('original user pass ='+user.password);
      
      var message = {};
      
      if (!user) {
        user = undefined;
        message.class = 'red';
        message.text = 'Incorrect username or password.';
      }
      
      return done(null, user, message);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null,user);
});
