"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'))
  , modelName = 'Setting';


exports.init = function(cb) {

  var schema = new Schema({
      slug: String
    , values: {}
    , createdAt: {type : Date, default : Date.now}
  });


  schema.pre('save', function(next) {
    this.slug = utils.slugify(this.values.name);
    
    next();
  });

  mongoose.model(modelName, schema);

  cb(null,null, modelName);
}
