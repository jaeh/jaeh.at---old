"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var categorySchema = new Schema({
    title: {type: String, trim: true}
  , slug: String
  , desc: String
  , logo: String
  , meta: {}
  , createdAt: {type : Date, default : Date.now}
});

categorySchema.path('title').validate(function (title) {
  return title.length > 0
}, 'category title cannot be blank');

mongoose.model('Category', categorySchema);
