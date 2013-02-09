"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));

var schema = new Schema({
  values: {
      title: {type: String, trim: true}
    , slug: String
    , footer: String
    , appname: String
    , logo: {src: String, alt: String, title: String}
    , meta: {}
    , createdAt: {type : Date, default : Date.now }
  }
});

//~ 
//~ schema.methods.getMenu = function() {
  //~ 
//~ }

schema.path('values.title').validate(function (title) {
  return title.length > 0
}, 'page title cannot be blank');

schema.pre('save', function(next) {
  this.slug = utils.slugify(this.title);
  
  next();
});

mongoose.model('PageData', schema);
