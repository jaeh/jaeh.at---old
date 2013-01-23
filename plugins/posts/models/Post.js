"use strict";

var mongoose = require('mongoose')
  , ObjectId = mongoose.Schema.Types.ObjectId
  , Schema = mongoose.Schema

var postSchema = new Schema({
    title: {type: String, trim: true}
  , slug: String
  , body: String
  , footer: String
  , logo: String
  , categories: []
  , meta: {
      mIs: {},
      og: {},
      gallery: {}
    }
  , createdAt: {type : Date, default : Date.now}
  //~ , author: ObjectId
});

postSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'page title cannot be blank');

mongoose.model('Post', postSchema);
