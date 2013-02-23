"use strict";

var path = require('path')
  , ejs = require('ejs')
  , utils = require(path.join(__dirname, '../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));

var admin = module.exports = {
    routes:   {}
  , rootDir:  __dirname
  , reqs: {
      gets:  []
    , posts: []
  }
};
 
admin.init = function(bonobo, cb) {
    
  cb(null, admin);
}

admin.setupRoutes = function(bonobo) {
  
  //~ admin.routes.admin = require(path.join(base.rootDir, '/routes/page')).page
  var gets = require(path.join(admin.rootDir, '/routes/gets'));
  var posts = require(path.join(admin.rootDir, '/routes/posts'));
  
  admin.reqs.gets.push({url: '/admin', route: gets.admin});
  admin.reqs.gets.push({url: '/admin/plugins', route: gets.plugins});
  admin.reqs.gets.push({url: '/admin/plugins/:pluginSlug', route: gets.pluginSettings});
  admin.reqs.gets.push({url: '/admin/users', route: gets.users});
  admin.reqs.gets.push({url: '/admin/users/:userSlug', route: gets.userDetails});
  
  admin.reqs.posts.push({url: '/admin/plugins/:pluginSlug', route: posts.pluginSettings});
}

