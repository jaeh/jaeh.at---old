"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var pageSchema = new Schema({
    title: {type: String, default : 'page title', trim: true}
  , slug: String
  , body: String
  , footer: String
  , logo: { src: String, title: String, alt: String }
  , meta: {
      mIs: [],
      og: {}
    }
  , createdAt: {type : Date, default : Date.now}
  , menu: String
});

pageSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'page title cannot be blank');




mongoose.model('Page', pageSchema);
