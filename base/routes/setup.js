"use strict";

var mongoose = require('mongoose')
  , slugify = require('../utils').slugify
  , base = require('../base');


exports.setup = function(req, res) {
  
  createPageData(mongoose.model('PageData'));
  createPages(mongoose.model('Page'));
  
  res.render('setup');
}


function createPageData(PageData) {
  //page data does not exist, inserting it
   
    var pageData = new PageData();
    
    pageData.title = 'jaeh.at',
    pageData.footer = 'main page footer',
    pageData.slug = slugify('jaeh.at'),
    pageData.logo = 'images/logo.png',
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
    
    console.log('saving pageData');
    
    pageData.save();
}

function createPages(Page) {
      
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
  page.save();


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
  
  page2.save();
  
  console.log('saved pages');
  
}
