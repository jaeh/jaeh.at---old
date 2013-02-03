"use strict";
var express = require('express')
  , mongoose = require('mongoose')
  , ejs = require('ejs')
  , fs = require('fs')
  , path = require('path')
  , passport = require('passport')
  , moment = require('moment');

var base = module.exports = express();

base.init = function() {

  base.rootDir = __dirname;
  
  base.modelPaths = [];
  
  return base;
}


base.config = function(rootDir) {
  
  //~ hbs.registerPartial('partial', fs.readFileSync(path.join(base.basedir, '/views/partial.hbs'), 'utf8'));
  
  base.configure(function() {
    
    base.set('port', process.env.PORT || 3000);
    
    base.set('views', path.join(rootDir, 'views')); // use appRootDir/views as template directory
    
    ejs.filters.momentize = function(date){
      //~ return moment(date).fromNow();
      return date;
    }
    
    base.set('view engine','ejs');  // use the EJS node module
      
    base.use(express.favicon(path.join(rootDir, '/public/images/favicon.ico')));
    
    base.use(require('stylus').middleware(path.join(rootDir, 'public')));
    
    base.use(express.static(path.join(rootDir, 'public')));
    
    base.use(express.logger('dev'));
    base.use(express.cookieParser('etgvwezgwegwgwgw'));
    base.use(express.bodyParser());
    base.use(express.methodOverride());
    
    base.use(express.session());
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    base.use(passport.initialize());
    base.use(passport.session());
    
    
    
    //custom middleware to get all base.locals that we need...
    base.use(function(req,res,next) {
      
      base.locals.utils = require(path.join(__dirname, "utils"));
    
      //~ XXX todo: change this to update every few minutes
      if(!base.locals.pageData) {
        
        base.locals.pageData = false;
        
        mongoose.model("PageData")
        .findOne()
        .exec(function(err, pageData) {      
          if(pageData) {
            base.locals.pageData = pageData;
          }
          next();
        });
      
      }else{
        next();
      }
      
    });

    //route page calls last
    base.use(base.router);

  });

}
