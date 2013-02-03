"use strict";


var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, "../../../base/utils"));


var schema = new Schema({
    name: {type: String, trim: true}
  , slug: String
  , email: String
  , password: String
  , createdAt: {type: Date, default: Date.now}
  , random: String
});


schema.pre('save',function(next) {
  this.slug = utils.slugify(this.name);
  
  next();
});

schema.path('name').validate(function (title) {
  return title.length > 0
}, 'user name cannot be blank');

schema.path('email').validate(function (email) {
  //~ XXX check if this is an email (server.utils will hold this func.)
  return email.length > 0
}, 'user email cannot be blank');


schema.path('password').validate(function (email) {
  //~ XXX check if this is an email (server.utils will hold this func.)
  return email.length > 0
}, 'user password cannot be blank');

mongoose.model('UserRegistration', schema);
