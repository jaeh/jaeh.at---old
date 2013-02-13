"use strict";

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema


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

  mongoose.model('OpenGraphData', schema);

  
  cb(null, {message: "OpenGraphData model setup success", css: "win"});

}
