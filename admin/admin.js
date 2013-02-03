"use strict";

var path = require('path')
  , ejs = require('ejs')
  , utils = require(path.join(__dirname, '../../base/utils'))
  , settings = require(path.join(__dirname, 'settings'));

var admin = module.exports = {
    routes:   {}
  , rootDir:  __dirname
  , modelPaths: []
  , reqs: {
        gets:  []
      , admin: []
  }
};
 
admin.init = function(bonobo, cb) {
  
  admin.modelPaths.push(path.join(admin.rootDir, 'models/'));
  
  
  ejs.filters.variableInputField = require(path.join(__dirname, 'lib', 'ejsfilters')).variableInputField;
  
  cb(null, admin);
}

admin.setupRoutes = function(bonobo) {
  
  //~ admin.routes.admin = require(path.join(base.rootDir, '/routes/page')).page
  admin.routes = require(path.join(admin.rootDir, '/routes/admin'));
  
  admin.reqs.gets.push({url: '/admin', route: admin.routes.admin});
  admin.reqs.gets.push({url: '/admin/settings', route: admin.routes.options});
  admin.reqs.gets.push({url: '/admin/settings/:pluginSlug', route: admin.routes.pluginOptions});
}

