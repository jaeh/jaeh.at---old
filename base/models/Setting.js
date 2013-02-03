"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));

var schema = new Schema({
    name: {type: String, trim: true}
  , slug: String
  , opts: {}
  , createdAt: {type : Date, default : Date.now}
});


schema.pre('save', function(next) {
  this.slug = utils.slugify(this.name);
  
  next();
});

mongoose.model('Setting', schema);
