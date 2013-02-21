"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));


exports.init = function(cb) {
  
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

  schema.path('values.text').validate(function (text) {
    return text.length > 0
  }, 'menuItem text cannot be blank');

  schema.path('values.url').validate(function (url) {
    return url.length > 0
  }, 'menuItem url cannot be blank');

  schema.pre('save', function(next) {
    
    
    this.values.slug = utils.slugify(this.values.text);
    
    if(this.values.published === "on" || this.values.published === true){
      this.values.published = true;
    }else{
      this.values.published = false;
    }
    
    

    next();
  });

  mongoose.model('MenuItem', schema);

  cb(null,null);
}
