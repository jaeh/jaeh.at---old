"use strict";

var mongoose = require('mongoose')
  , slugify = require('../utils').slugify
  , base = require('../base');

/*
 * GET home page.
 */

exports.page = function(req, res){

  var Page = mongoose.model('Page');
  
  var pageSlug = req.params.page;
  
  if(!pageSlug || pageSlug === "/"){
    pageSlug = "home"
  }
    
  //database call for page content here
  
  //looking for the requested page
  Page
  .findOne({slug: pageSlug})
  .exec(function(err, page) {
    
    if(!base.locals.pageData){      
      console.log('pageData not found in db, redirecting to setup');
      res.redirect("setup");
      return;
    }
    
    if(!page){
      console.log('page not found in db, redirecting to 4oh4');
      res.redirect("4oh4");
      return;
    }
    
    console.log('loading '+pageSlug+ ", found page in db");
    
    res.render('page', {page: page});
    return;
  });	
}
