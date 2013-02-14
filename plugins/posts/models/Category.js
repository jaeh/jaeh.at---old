"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../../../base/utils'));

exports.init = function(cb) {

  var schema = new Schema({
      title: {type: String, trim: true}
    , slug: String
    , desc: String
    , logo: String
    , meta: {}
    , createdAt: {type : Date, default : Date.now}
  });


  schema.pre('save', function(next) {
    this.slug = utils.slugify(this.title);
    
    next();
  });

  schema.path('title').validate(function (title) {
    return title.length > 0
  }, 'category title cannot be blank');

  mongoose.model('Category', schema);

  cb(null, {message: "Category model setup success", css: "win"});
}
  
