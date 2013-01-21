"use strict";

/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  //~ , models = require('./models')
  , mongoose = require('mongoose')
  , config = require('./config')
  , SHA512 = require('./lib/sha512')
  , path = require('path');
  
module.exports = function(app){
	app.admindir = __dirname;

	config.configure(app);

	// Bootstrap models	
	var models_path = path.join(app.admindir, '/models');
	
	fs.readdirSync(models_path).forEach(function (file) {
	  //~ console.log('enabling model '+file);
	  require(path.join(models_path, '/'+file));
	});
//~ 
	//~ //register routes
	//~ var routes_path = path.join(app.admindir, '/routes');
	//~ 
	//~ fs.readdirSync(routes_path).forEach(function (file) {
	  //~ if(!app.routes[file]) {
	    //~ app.routes[file] = require(path.join(routes_path, '/'+file));
	  //~ }else{
	    //~ console.log("route "+file+" has already been created");
	  //~ }
	//~ });
	//~ 
	//~ app.get('/admin', app.routes.admin);
	

}
