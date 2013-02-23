"use strict";

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema
  , modelName = 'OpenGraphData';


exports.init = function(cb) {
  var schema = new Schema({
    values: {
        content: {type: String, trim: true}
      , tag: String
      , pageSlug: String
      , published: Boolean
    }
  });


  schema.pre('save', function(next) {
    
    if(this.values.published == "on") {
      this.values.published = true;
    }else{
      this.values.published = false;
    }
    
    next();
  });

  mongoose.model(modelName, schema);

  cb(null,null, modelName);

}
