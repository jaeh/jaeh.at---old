"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));

var schema = new Schema({
    title: {type: String, trim: true}
  , slug: String
  , body: String
  , footer: String
  , logo: { src: String, title: String, alt: String }
  , meta: {}
  , createdAt: {type : Date, default : Date.now}
  , menu: String
});

schema.path('title').validate(function (title) {
  return title.length > 0
}, 'page title cannot be blank');


schema.pre('save', function(next) {
  this.slug = utils.slugify(this.title);
  
  next();
});


mongoose.model('Page', schema);
