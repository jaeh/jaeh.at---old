"use strict";

var mongoose = require('mongoose')
  , slugify = require('../utils').slugify
  , base = require('../base');

/*
 * GET home page.
 */

exports.page = function(req, res){

  var PageData = mongoose.model('PageData')
  , Page = mongoose.model('Page');
  
  var pageSlug = req.params.page;
  
  if(!pageSlug || pageSlug === "/"){
    pageSlug = "home"
  }
    
  //database call for page content here
  PageData
  .findOne()
  .exec(function(err, pageData) {      
    
    console.log(pageData);
    
    
    if(!pageData) {
      //~ XXX call init function here, pageData does not exist yet. this should be replaced by an error later
      res.redirect("setup");
      return;
    }
    //looking for the requested page
    Page
    .findOne({slug: pageSlug})
    .exec(function(err, page) {
      
      if(!page){
        res.redirect("4oh4");
        return;
      }
      
      console.log('loading '+pageSlug+ " found pageData and page");
      
      res.render('page', {'pageData': pageData, 'page': page});
      return;
      
    });	
  });
}
