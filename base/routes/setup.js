"use strict";

var mongoose = require('mongoose')
  , slugify = require('../utils').slugify
  , base = require('../base')
  , bonobo = require('../../bonobo');

var routes = module.exports = {
    gets: {},
    posts: {}  
};

routes.gets.setup = function(req, res) {
  res.render('setup', {showform: "true"});
}

routes.posts.setup = function(req, res){
  
  var PageData = mongoose.model('PageData');
  
  PageData.findOne().exec(function(err, pageData) {
    //~ console.log('pageData in setup =');
    //~ console.log(pageData);
    //~ 
    //~ if(!pageData) {
      createPages(function(err, createPageReturn) {
        
        createPageData(function(err, createPageDataInfo) {
          if(err) throw err;
          
          bonobo.DoTheSetup(function(err, messages) {
            //~ console.log('bonobo.dothesetup called');
            res.render('setup', {messages: messages, completed: true});
          });
        });
      });
    //~ }else{
      //~ res.render('setup', {completed: true});
    //~ }
  });
}

function createPageData(cb) {
  //page data does not exist, inserting it
   
  var PageData = mongoose.model("PageData");
 
  var pageData = new PageData();
  
  pageData.title = 'jaeh.at',
  pageData.footer = 'main page footer',
  pageData.slug = slugify('jaeh.at'),
  pageData.logo = '/images/logo.png',
  pageData.meta = {
    og: {
      "title": "jaeh.at"
    },
    aside: {
      title: "aside title",
      body: "aside body",
      widgets: [
        { name: "widget 1", title: "widget title", body: "widget body content"},
        { name: "widget 2", title: "widget 2 title", body: "widget 2 body content"} 
      ]
    },
    mIs: {
      header: [
        { url: "/", text: "home", menu: "header"},
        { url: "/about", text: "about", menu: "header"}
      ],
      footer: [
        { url: "/impressum", text: "impressum", menu: "footer"}
      ]
    }
  }
  
  base.locals.pageData = pageData;
  
  pageData.save(function(err) {
    var ret = err;
    
    if(!err) ret = "pagedata setup successfull";
    
    console.log('saved pageData');

    cb(err, ret);
  });
  
}

function createPages(cb) {
  
  var Page = mongoose.model("Page");
  
  var page = new Page();
  page.title = '4oh4';
  page.slug = '4oh4';
  page.body = '4oh4 page body';
  page.footer = '4oh4 page footer';
  page.logo = {
    src: '/images/pagelogos/4oh4.png',
    title: '4oh4 logo title',
    alt: '4oh logo alt'
  };


  var page2 = new Page();
  page2.title = 'home';
  page2.slug = 'home';
  page2.body = 'home page body';
  page2.footer = 'home page footer';
  page2.logo = {
    src: '/images/pagelogos/home.png',
    title: 'page logo home title',
    alt: 'page logo home alt'
  };
  
  page.save(function(err) {
    
    page2.save(function(err) {
      
      console.log('saved pages');
  
      cb(null, "pages saved");
    });
  });
}
