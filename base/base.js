"use strict";
var express = require('express')
  , mongoose = require('mongoose')
  , hbs = require('hbs')
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
    
    base.set('view engine', 'hbs');
    
    base.set('views', path.join(viewRootDir, 'views'));    
    
    base.use(express.logger('dev'));
    base.use(express.cookieParser());
    base.use(express.bodyParser());
    base.use(express.methodOverride());
    
    
    base.use(express.session({ secret: 'spoiegnq0fnqoewslkncwsl39' }));
    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    base.use(passport.initialize());
    base.use(passport.session());
    
    
    base.use(express.favicon(path.join(base.rootDir, '/public/images/favicon.ico')));
    
    base.use(require('stylus').middleware(path.join(base.rootDir, 'public')));
    
    base.use(express.static(path.join(base.rootDir, 'public')));
    
    //custom middleware to get the pagedata if it hasnt been set.
    base.use(function(req,res,next) {
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
    
    base.use(function(req,res,next) {
      console.log('after router');
      
      next();
    });
  });

}
