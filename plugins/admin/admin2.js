"use strict";
var express = require('express')
  , mongoose = require('mongoose')
  , ejs = require('ejs')
  , fs = require('fs')
  , path = require('path')
  , passport = require('passport')
  , moment = require('moment');

var admin = module.exports = express();

admin.init = function() {

  admin.rootDir = __dirname;
  
  admin.modelPaths = [];
  
  return admin;
}


admin.config = function(viewRootDir) {
  
  //~ hbs.registerPartial('partial', fs.readFileSync(path.join(admin.admindir, '/views/partial.hbs'), 'utf8'));
  
  admin.configure(function(rootDir) {
    
    admin.set('port', process.env.PORT || 3001);
    
    admin.set('views', path.join(rootDir, 'views')); // use appRootDir/views as template directory
    
    ejs.filters.momentize = function(date){
      //~ return moment(date).fromNow();
      return date;
    }
    
    admin.set('view engine','ejs');  // use the EJS node module
      
    admin.use(express.favicon(path.join(rootDir, '/public/images/favicon.ico')));
    
    admin.use(require('stylus').middleware(path.join(rootDir, 'public')));
    
    admin.use(express.static(path.join(rootDir, 'public')));
    
    admin.use(express.logger('dev'));
    admin.use(express.cookieParser('allhaileris'));
    admin.use(express.bodyParser());
    admin.use(express.methodOverride());
    
    admin.use(express.session());
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    admin.use(passport.initialize());
    admin.use(passport.session());
    
    //custom middleware to get all admin.locals that we need...
    admin.use(function(req,res,next) {
      
      admin.locals.utils = require(path.join(__dirname, "utils"));
    
      //~ XXX todo: change this to update every few minutes
      if(!admin.locals.pageData) {
        
        admin.locals.pageData = false;
        
        mongoose.model("PageData")
        .findOne({slug: "admin"})
        .exec(function(err, pageData) {      
          if(pageData) {
            admin.locals.pageData = pageData;
          }
          next();
        });
      
      }else{
        next();
      }
      
    });

    //route page calls last
    admin.use(admin.router);

  });

}
