"use strict";
var express = require('express')
  , mongoose = require('mongoose')
  , ejs = require('ejs')
  , fs = require('fs')
  , path = require('path')
  , passport = require('passport')
  , moment = require('moment')
  , stylus = require('stylus');

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
    //~ 
    //~ ejs.open = '{{';
    //~ ejs.close = '}}';

    ejs.filters.momentize = function(date){
      //~ return moment(date).fromNow();
      return date;
    }
    
    base.set('view engine','ejs');  // use the EJS node module
      
    base.use(express.favicon(path.join(rootDir, '/public/images/favicon.ico')));
    
//    base.use(require('stylus').middleware(path.join(rootDir, 'public')));
    function compile(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true);
        //.use(nib());
    }

    base.use(stylus.middleware({
        src: path.join(__dirname, 'public')
      , compile: compile
    }));
    
    base.use(express.static(path.join(rootDir, 'public')));
    
    base.use(express.logger('dev'));
    
    base.use(express.compress());
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
     
        
      mongoose.model("PageData")
      .findOne({"values.appname": "base"})
      .exec(function(err, pageData) {
        if(pageData && pageData.values) {
          base.locals.pageData = pageData.values;
        
        }else{
          if(req.path.indexOf('setup') === -1) {
            res.redirect('/setup');
            return;
          }
        }
        
        next();
      });      
    });

    //route page calls last
    base.use(base.router);

  });
}

base.GetPageData = function(cb) {
  
  var PageData = mongoose.model("PageData");
  
  PageData.findOne({'values.appname': 'base'}).exec(function(err, pageData) {
    
    if(!pageData ) {
      pageData = new PageData();
      pageData.values = require(path.join(__dirname, 'settings')).pageData;
      pageData.save(function(err){
          returnPageData(null, pageData, cb);
      });
      return;
    }
    
    returnPageData(null, pageData, cb);
  });
}

base.UpdatePageData = function(object, cb) {
  if(!object || !cb) {
    cb("base.UpdatePageData(object, callback) called with missing arguments"); 
  }
  
  var PageData = mongoose.model("PageData");
  
  PageData.findOne({'values.appname': 'base'}).exec(function(err, pageData) {
 
    if(!pageData ) {
      pageData = new PageData();
    }

    pageData.values = object;
        
    pageData.save(function(err) {
      returnPageData(err, pageData, cb);
    });
    
  });
}

function returnPageData (err, pageData, cb) {
  cb(err, pageData);
}
