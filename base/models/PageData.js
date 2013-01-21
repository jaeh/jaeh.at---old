"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var pageDataSchema = new Schema({
    title: {type: String, trim: true}
  , slug: String
  , footer: String
  , logo: String
  , meta: {
      mIs: {},
      og: {},
      aside: {}
    }
  , createdAt: {type : Date, default : Date.now}
});
//~ 
//~ pageDataSchema.methods.getMenu = function() {
  //~ 
//~ }

pageDataSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'page title cannot be blank');

mongoose.model('PageData', pageDataSchema);
