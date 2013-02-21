"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , path = require('path')
  , utils = require(path.join(__dirname, '../utils'));


exports.init = function(cb) {

  var schema = new Schema({
      slug: String
    , values: {}
    , createdAt: {type : Date, default : Date.now}
  });


  schema.pre('save', function(next) {    


    if(typeof this.values.name === "object"){ 
      this.slug = utils.slugify(this.values.name.value);
    }else if( typeof this.values.name === "string") {
      this.slug = utils.slugify(this.values.name);
    }
    
    next();
  });

  mongoose.model('Setting', schema);

  cb(null, {message: "Setting model setup success", css: "win"});
}
