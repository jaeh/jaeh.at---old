"use strict";
var express = require('express')
  , mongoose = require('mongoose')
  , ejs = require('ejs')
  , fs = require('fs')
  , path = require('path')
  , passport = require('passport');

var base = module.exports = express();

base.init = function() {

  base.rootDir = __dirname;
  
  base.modelPaths = [];
  
  return base;
}


base.config = function(viewRootDir) {
  
  //~ hbs.registerPartial('partial', fs.readFileSync(path.join(base.basedir, '/views/partial.hbs'), 'utf8'));
  
  base.configure(function() {
    
    base.set('port', process.env.PORT || 3000);
    
    base.set('views', path.join(viewRootDir, 'views')); // use appRootDir/views as template directory
    
    base.set('view engine','ejs');  // use the EJS node module
    
        
    base.use(express.favicon(path.join(base.rootDir, '/public/images/favicon.ico')));
    
    base.use(require('stylus').middleware(path.join(base.rootDir, 'public')));
    
    base.use(express.static(path.join(base.rootDir, 'public')));
    
    
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
      
      base.locals.utils = {
        each: function(arrayOrObject, cb) {
         
          var array = [];
                    
          for(var key in arrayOrObject) {
            array.push( {
              value: arrayOrObject[key],
              key: key
            });
            
          }  
          
          for(var i = 0; i < array.length; i++){
            cb(array[i]);
          }
        },
        
        
        exists: function(obj) {
          if(typeof obj != undefined) {
            return obj;
          }
          return false;
        },
        
        count: function(arrayOrObject) {
          console.log('typeof = '+typeof arrayOrObject);
          
          if(typeof arrayOrObject !== 'array' && typeof arrayOrObject !== 'object') {
            return -1;
          }
          
          var count = 0;
          for(var i in arrayOrObject) {
            count++;
          }
          return count;
        }
      }
    
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
