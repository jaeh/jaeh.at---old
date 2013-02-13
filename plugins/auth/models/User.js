"use strict";

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema


exports.init = function(cb) {

  var schema = new Schema({
      name: {type: String, trim: true}
    , slug: String
    , about: String
    , role: String
    , email: String
    , password: String
    , logo: String
    , meta: {}
    , createdAt: {type : Date, default : Date.now}
    //~ , author: ObjectId
  });


  schema.pre('save',function(next) {
    this.slug = utils.slugify(this.name);
    
    next();
  });


  schema.path('role').validate(function (role) {
    if(!role) role = "user";
    
    return role && (role == "admin" || role == "editor" || role == "moderator" || role == "user");
    
  }, 'user role has to be admin, editor, moderator or user');


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

  mongoose.model('User', schema);


  cb(null, {message: "User model setup success", css: "win"});
}
