"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));

exports.init = function(cb) {

  var schema = new Schema({
    values: {
        title: {type: String, trim: true}
      , slug: String
      , body: String
      , footer: String
      , published: Boolean
      , logo: { src: String, title: String, alt: String }
      , meta: {}
      , createdAt: {type : Date, default : Date.now}
      , menu: String
    }
  });

  schema.path('values.title').validate(function (title) {
    return title.length > 0
  }, 'page title cannot be blank');


  schema.pre('save', function(next) {
    this.values.slug = utils.slugify(this.values.title);
    
    next();
  });


  schema.pre('save', function(next) {
    this.values.slug = utils.slugify(this.values.title);
    
    if(this.values.published === "on" || this.values.published === true) {
      this.values.published = true;
    }else{
      this.values.published = false;
    }
    
    next();
  });

  mongoose.model('Page', schema);


  cb(null, {message: "Page model setup success", css: "win"});
}
