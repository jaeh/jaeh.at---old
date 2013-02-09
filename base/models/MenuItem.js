"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));

var schema = new Schema({
  values: {
      text: String
    , slug: String
    , url: String
    , pos: Number
    , menu: String
    , published: Boolean
  }
});

//~ 
//~ schema.methods.getMenu = function() {
  //~ 
//~ }

schema.path('values.text').validate(function (text) {
  return text.length > 0
}, 'menuItem text cannot be blank');

schema.path('values.url').validate(function (url) {
  return url.length > 0
}, 'menuItem url cannot be blank');

schema.pre('save', function(next) {
  
  this.values.slug = utils.slugify(this.values.text);
  
  console.log('this.values.published before = '+this.values.published);
  
  if(this.values.published === "on"){
    this.values.published = true;
  }else{
    this.values.published = false;
  }
  
  
  console.log('this.values.published after = '+this.values.published);
  
  next();
});

mongoose.model('MenuItem', schema);
