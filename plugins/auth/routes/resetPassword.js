"use strict";

var mongoose          = require('mongoose')
  , UserRegistration  = mongoose.model('UserRegistration')
  , User              = mongoose.model('User')
  , SHA512            = new(require('jshashes').SHA512)();


var resetPasswordRoutes = module.exports = {
    gets: {},
    posts: {}
};


resetPasswordRoutes.gets.resetPassword = function(req, res) {
  res.render('auth/resetPassword');
}

resetPasswordRoutes.posts.resetPassword = function(req, res) {
  res.render('auth/resetPassword');
}



resetPasswordRoutes.gets.resetPasswordConfirm = function(req, res) {
  res.render('auth/resetPasswordConfirm');
}

resetPasswordRoutes.posts.resetPasswordConfirm = function(req, res) {
  res.render('auth/resetPasswordConfirm');
}


