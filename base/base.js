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
  , bonobo = require(path.join(__dirname, '..', 'bonobo', 'bonobo'))
  , base = module.exports = express();

base.rootDir = __dirname;

base.config = function (server, cb) {
  
  base.configure(function () {
    
    base.set('views', path.join(server.rootDir, 'views')); // use appRootDir/views as template directory

    require(path.join(__dirname, 'ejsfilters'))();
    
    base.set('view engine','ejs');  // use the EJS node module
      
    base.use(express.favicon(path.join(server.rootDir, '/public/images/favicon.ico')));
    
    base.use(stylus.middleware({
        src: server.rootDir + '/public/'
      , compile: function (str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true);
        //.use(nib());
      }
    }));
    
    base.use(express.static(path.join(server.rootDir, 'public')));
    
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
    base.use(function (req, res, next) {
      
      base.locals.utils = utils;
      
      //~ mongoose.model("PageData").findOne({},function(err,pg){
        //~ console.log('pg =');
        //~ console.log(pg);
      //~ });
      
      mongoose.model("PageData").findOne({"values.appname": "base"}, function (err, pageData) {
        
        if (!pageData) {
        
          if (req.path.indexOf('setup') === -1) {
            res.redirect('/setup');
            return;
          }
        }
        if (pageData && pageData.values) {
          base.locals.pageData = pageData.values;
        }
        
        next();
      });      
    });

    //custom middleware to get all menuitems that are published...
    base.use(function (req,res,next) {
      
      mongoose.model("MenuItem").find({"values.published": true}).sort({"values.pos": "asc"}).exec(function (err, menuItems) {
        
        var mIs = {}
        
        utils.deprecated_each(menuItems, function (mI) {
          
          if (!mIs[mI.value.values.menu]) mIs[mI.value.values.menu] = [];
          
          mIs[mI.value.values.menu].push(mI.value.values);
        });
        
        //assign to base.locals to make available in all views
        if (utils.count(mIs) > 0 ) {
          base.locals.menuItems = mIs;
        }
        next();
      });      
    });
    
    base.use(function(req,res,next) {
      //execute plugin middleware
      bonobo.DoTheMiddleWare(base, req, res, next);
    });
      
    //route page calls last
    base.use(base.router);
  });
  
  //setup the mongodb and the errorhandlers
  base.configure('development', function () {
    base.use(express.errorHandler());
    
    // Bootstrap db connection
    mongoose.connect(server.settings.mongodb.url+':'+server.settings.mongodb.port+'/'+server.settings.mongodb.db);
  });
  
  cb(null, [{message: "base configure success", css: "win"}]);
}

base.GetPageData = function (cb) {
  
  var PageData = mongoose.model("PageData");
  
  PageData.findOne({'values.appname': 'base'}).exec(function (err, pageData) {
    
    if (!pageData ) {
      pageData = new PageData();
      pageData.values = require(path.join(__dirname, 'settings')).pageData;
      pageData.save(function (err) {
          returnPageData(null, pageData, cb);
      });
      return;
    }
    
    returnPageData(null, pageData, cb);
  });
}

base.UpdatePageData = function (object, cb) {
  if (!object || !cb) {
    cb("base.UpdatePageData(object, callback) called with missing arguments"); 
  }
  
  var PageData = mongoose.model("PageData");
  
  PageData.findOne({'values.appname': 'base'}).exec(function (err, pageData) {
 
    if (!pageData ) {
      pageData = new PageData();
    }

    pageData.values = object;
        
    pageData.save(function (err) {
      returnPageData(err, pageData, cb);
    });
    
  });
}

function returnPageData (err, pageData, cb) {
  cb(err, pageData);
}
