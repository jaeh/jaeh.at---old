"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var userSchema = new Schema({
    title: {type: String, default : 'user title', trim: true}
  , slug: String
  , body: String
  , footer: String
  , logo: { src: String, title: String, alt: String }
  , meta: {
      mIs: [],
      og: {}
    }
  , createdAt: {type : Date, default : Date.now}
  , menu: String
});

userSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'user title cannot be blank');




mongoose.model('user', userSchema);
