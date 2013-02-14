"use strict";


var path      = require('path')
  , fs        = require('fs')
  , mongoose  = require('mongoose')
  , utils = require(path.join(__dirname, '..', 'base', 'utils'))
  , server = require(path.join(__dirname, '..', 'server'));


exports.init = function(bonobo) {

  bonobo.RouteThemAll = function(base, cb) {
  
    //first handle errors:
    //load and setup routes
    base.routes.pages = require(path.join(base.rootDir, '/routes/page')).page;
    base.routes.setup = require(path.join(base.rootDir, '/routes/setup'));
    
    if( !base.locals.pageData ) {
     //~ setup post and get for the setup page. settings can be changed later using the admin module
      base.get('/setup', base.routes.setup.gets.setup);
      base.post('/setup', base.routes.setup.posts.setup);
    }
    
    var doneI = 0;
    for(var pluginName in bonobo.plugins) {
      var pl = bonobo.plugins[pluginName];
      
      doneI++;
      
      if(pl && pl.setupRoutes && typeof pl.setupRoutes === "function") {
        pl.setupRoutes(bonobo, function() {
         
          if(doneI >= utils.count( bonobo.plugins) ) {
            //~ console.log('plugin setuproutes doneI ='+doneI+" bonobo.plugins.length = "+utils.count(bonobo.plugins));
          
                 
            // setup page requests

            //first set the user of this request:
            
            base.get("*", function(req,res, next) {
              base.locals.currentUser = req.user;
              next();
            });

            base.gets = [];
            base.posts = [];
            
            base.gets.push({ url: '/', route: base.routes.pages});
              
            //get the requests from the plugins and add them to the base requests
            
            for(var plIdx in bonobo.plugins) {
              var reqs = bonobo.plugins[plIdx].reqs;
              //~ console.log('reqs = ');
              //~ console.log(reqs);
              
              for(var idx in reqs) {
                
                var verbs = reqs[idx];
                //~ console.log('verbs = ');
                //~ console.log(verbs);
                for(var verb in verbs) {
                  var fE = verbs[verb];
                  //~ console.log('fE =');
                  //~ console.log(fE);
                  if(fE.url && fE.route) {
                    base[idx].push(fE);
                  }
                }
              }
            }
            
            //pushing this last ensures the 4oh4 page gets called and this url filter works.
            base.gets.push({url: '/:page', route: base.routes.pages});
            
            for(var idx in base.gets) {
              var getter = base.gets[idx];
              if(getter.url && getter.route) {
                //~ console.log('initialise getter:');
                //~ console.log(getter);
                if(getter.middleware) {
                  base.get(getter.url, getter.middleware, getter.route);
                  return;
                }
                
                base.get(getter.url, getter.route);
              }
            }

            for(var idx in base.posts) {
              var poster = base.posts[idx];
              if(poster.url && poster.route) {
                //~ console.log('initialise poster:');
                //~ console.log(poster);
                if(poster.middleware) {
                  base.post(poster.url, poster.middleware, poster.route);
                  return;
                }
                
                base.post(poster.url, poster.route);
              }
            }
            
            var Route4oh4 = function(req,res) {
              res.redirect('4oh4');
            }
            
            //4oh4 page handler
            base.get("*", Route4oh4);
            base.post("*", Route4oh4);
            
            cb(null, [{message: 'bonobo.RouteThemAll finished successfully', css:"win"}]);
          }
        });
      }
    }
  }
}
