"use strict";

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema

var userSchema = new Schema({
    name: {type: String, trim: true}
  , slug: String
  , email: String
  , password: String
  , logo: String
  , meta: {}
  , createdAt: {type : Date, default : Date.now}
  //~ , author: ObjectId
});

userSchema.path('name').validate(function (title) {
  return title.length > 0
}, 'user name cannot be blank');

userSchema.path('email').validate(function (email) {
  //~ XXX check if this is an email (server.utils will hold this func.)
  return email.length > 0
}, 'user email cannot be blank');

userSchema.path('password').validate(function (email) {
  //~ XXX check if this is an email (server.utils will hold this func.)
  return email.length > 0
}, 'user password cannot be blank');

mongoose.model('User', userSchema);


var userRegistrationSchema = new Schema({
    name: {type: String, trim: true}
  , email: String
  , password: String
  , createdAt: {type: Date, default: Date.now}
  , random: String
});


userRegistrationSchema.path('name').validate(function (title) {
  return title.length > 0
}, 'user name cannot be blank');

userRegistrationSchema.path('email').validate(function (email) {
  //~ XXX check if this is an email (server.utils will hold this func.)
  return email.length > 0
}, 'user email cannot be blank');


userRegistrationSchema.path('password').validate(function (email) {
  //~ XXX check if this is an email (server.utils will hold this func.)
  return email.length > 0
}, 'user password cannot be blank');

mongoose.model('UserRegistration', userRegistrationSchema);
