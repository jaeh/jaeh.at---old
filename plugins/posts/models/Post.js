"use strict";

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '..', '..', '..', 'base', 'utils'))
  , modelName = 'Post';

exports.init = function(cb) {
  
  var schema = new Schema({
      title: {type: String, trim: true}
    , slug: String
    , body: String
    , footer: String
    , logo: String
    , categories: []
    , mIs: {}
    , gallery: {}
    , createdAt: {type : Date, default : Date.now}
    , author: ObjectId
  });

  schema.pre('save', function(next) {
    this.slug = utils.slugify(this.title);
    
    next();
  });

  schema.path('title').validate(function (title) {
    return title.length > 0
  }, 'page title cannot be blank');

  
  mongoose.model(modelName, schema);

  cb(null,null, modelName);
}
