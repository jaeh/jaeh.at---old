"use strict";

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var optionsSchema = new Schema({
    opt: []
  , version: String
  , createdAt: {type : Date, default : Date.now}
  , plugin: String
});

mongoose.model('PluginOptions', optionsSchema);
