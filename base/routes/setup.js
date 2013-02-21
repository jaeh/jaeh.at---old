'use strict';

var mongoose = require('mongoose')
  , path = require('path')
  , slugify = require(path.join('..','utils')).slugify
  , base = require(path.join('..', 'base'))
  , bonobo = require(path.join('..', '..', 'bonobo', 'bonobo'))
  , utils = require(path.join('..', 'utils'));

var routes = module.exports = {
  gets  : {},
  posts : {}  
};

routes.gets.setup = function (req, res) {
  var settings = require(path.join(__dirname, '..', 'settings'));
  
  res.render('setup', {showform: 'true', settings: settings});
}

routes.posts.setup = function (req, res) {
  
  var errs = []
    , msgs = [];
  
  var reqBody = utils.requestBodyToJSON(req.body);
  
  
  createPageData(reqBody.pageData, function (err, msg) {
    if (err) { utils.each(err, function (key,err) {if (typeof err === "object") errs.push(err)}); }
    if (msg) { utils.each(msg, function (key,msg) {if (typeof msg === "object") msgs.push(msg)}); }
      
    createPages(reqBody.pages, function (err, msg) {      
      
      if (err) { utils.each(err, function (key,err) {if (typeof err === "object") errs.push(err)}); }
      if (msg) { utils.each(msg, function (key,msg) {if (typeof msg === "object") msgs.push(msg)}); }
            
      bonobo.DoTheSetup(function (err, msg) {
        
        if (err) { utils.each(err, function (key,err) {if (typeof err === "object") errs.push(err)}); }
        if (msg) { utils.each(msg, function (key,msg) {if (typeof msg === "object") msgs.push(msg)}); }
             
        createMenuItems(reqBody.mIs, function (err, msg) {
          if (err) { utils.each(err, function (key,err) {if (typeof err === "object") errs.push(err)}); }
          if (msg) { utils.each(msg, function (key,msg) {if (typeof msg === "object") msgs.push(msg)}); }
          
          res.render('setup', {showform: 'false', errs: errs, msgs: msgs});
        });
      });
    });
  });
}

function createPageData(pD, cb) {
  //page data does not exist, inserting it
   
  var PageData = mongoose.model('PageData');
  
  PageData.findOne({'values.appname': pD.appname}, function(err, pageData) {
    pageData = pageData || new PageData();
    
    pageData.values = pD;
    
    pageData.save(function (err) {
      var msg = [false];
      
      if (!err) {      
        msg = [{message: 'pageData save successful', css: 'win'}];
      } else {
        err = [{message: err, css: 'err failure'}];
      }
      cb(err, msg);
    });
  });
}

function createPages(pages, cb) {
  
  var Page = mongoose.model('Page');

  var msgs = [];
  var errs = [];
  
  var i = 0;
  
  utils.each(pages, function (key, pageValues) {    
  
    
    Page.findOne({'values.slug': utils.slugify(pageValues.title)}, function (err, page) {
      page = page || new Page();
      
      page.values = pageValues;
    
      page.save(function (err) {
        var msg = [false];
        
        if (!err) {      
          msgs.push({message: 'page '+page.values.title+' save successful', css: 'win'});
        } else {
          errs.push({message: 'page '+page.values.title+' save errored: '+err, css: 'err failure'});
        }
        
        
        i++;
        
        if (i >= utils.count(pages) ) {
          if (errs.length == 0) {
            msgs.push({message: 'page setup successful, added '+i+' pages', css: 'win'});
          }else{
            msgs.push({message: 'page setup completed with errors', css: 'fail'});
          }
          
          cb(errs, msgs);
        }
      });
    });
  });
}

function createMenuItems(mIs, cb) {
    
  var msgs = [];
  var errs = [];
  
  var i = 0;
  
  utils.each(mIs, function (key, value) {
    
    bonobo.addMenuItem(value, function (err, msg, menuItem) {        
        
      i++;    
              
      if (i >= utils.count(mIs) ) {
        if (errs.length == 0) {
          msgs.push({message: 'menuItem setup successful, added '+i+' menuItems', css: 'win'});
        }else{
          errs.push({message: 'menuItem setup completed with '+utils.count(errs)+' errors', css: 'fail'});
        }
        cb(errs, msgs);
      }
    });
  });
}

