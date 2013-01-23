"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var pageDataSchema = new Schema({
    title: {type: String, trim: true}
  , slug: String
  , footer: String
  , logo: String
  , meta: {}
  , createdAt: {type : Date, default : Date.now}
});
//~ 
//~ pageDataSchema.methods.getMenu = function() {
  //~ 
//~ }

pageDataSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'page title cannot be blank');

pageDataSchema.pre('save', function(next) {
  console.log('pageDataSchema has been saved');
  next();
});

mongoose.model('PageData', pageDataSchema);
