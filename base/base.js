"use strict";
var express = require('express')
  , mongoose = require('mongoose')
  , ejs = require('ejs')
  , fs = require('fs')
  , path = require('path')
  , passport = require('passport')
  , moment = require('moment')
  , stylus = require('stylus')
  , utils = require(path.join(__dirname, "utils"))
  , bonobo = require(path.join(__dirname, '..', 'bonobo'));
  

var base = module.exports = express();

base.rootDir = __dirname;

base.modelPaths = [];

base.init = function(cb) {  
  cb(base);
}


base.config = function(rootDir, cb) {
  
  base.configure(function() {
    
    base.set('port', process.env.PORT || 3000);
    
    base.set('views', path.join(rootDir, 'views')); // use appRootDir/views as template directory
    //~ 
    //~ ejs.open = '{{';
    //~ ejs.close = '}}';

    require(path.join(__dirname, 'ejsfilters'))();
    
    base.set('view engine','ejs');  // use the EJS node module
      
    base.use(express.favicon(path.join(rootDir, '/public/images/favicon.ico')));
    
    function compile(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true);
        //.use(nib());
    }

    base.use(stylus.middleware({
        src: rootDir + '/public/'
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
      
      base.locals.utils = utils;
    
      mongoose.model("PageData")
      .findOne({"values.appname": "base"}, function(err, pageData) {
        
        if(!pageData) {
        
          if(req.path.indexOf('setup') === -1) {
            res.redirect('/setup');
            return;
          }
        
        }
        if(pageData && pageData.values) {
          base.locals.pageData = pageData.values;
        }
        
        next();
      });      
    });

    //custom middleware to get all base.locals that we need...
    base.use(function(req,res,next) {
     
      mongoose.model("MenuItem").find({"values.published": true}).sort({"values.pos": "asc"}).exec(function(err, menuItems) {
        
        console.log('menuITems in base middleware=');
        console.log(menuItems);
        //~ 
        var mIs = {}
        
        utils.each(menuItems, function(mI){
          //~ console.log('saving menuitem to ');
          //~ console.log(mI.value);
          if(!mIs[mI.value.values.menu]) mIs[mI.value.values.menu] = [];
          
          mIs[mI.value.values.menu].push(mI.value.values);
        });
        
        if(utils.count(mIs) > 0 ) {
          base.locals.menuItems = mIs;
        }
        next();
      });      
    });
    
    
    //add custom plugin middleware from bonobo if any is there.
    utils.each(bonobo.middleWare, function(mW) {
      if(typeof mW === 'function' ) {
        base.use(mW);
      }
    });
    //route page calls last
    base.use(base.router);

  });
  
  cb();
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
