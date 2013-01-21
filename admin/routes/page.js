"use strict";

var mongoose = require('mongoose')
  , PageData = mongoose.model('PageData')
  , Page = mongoose.model('Page')
  , MenuItem = mongoose.model('MenuItem')
  , slugify = require(__dirname+ '/../utils').slugify;

/*
 * GET home page.
 */

exports.page = function(req, res){
  
  var pageSlug = req.params.page;
  
  if(!pageSlug || pageSlug === "/"){
    pageSlug = "home"
  }
  
  //~ console.log('pageSlug ='+pageSlug);
  
  //database call for page content here
  
  PageData
  .findOne()
  .exec(function(err, pageData) {
    
    MenuItem
    .find({})
    .exec(function(err, menuItems) {
      
      if(menuItems.length === 0) {
        menuItems = initMenuItems();
      }      
      
      var mIs = {};
      
      for(var i in menuItems) {
        if(!mIs[menuItems[i].menu]) 
          mIs[menuItems[i].menu] = [];
        
        mIs[menuItems[i].menu].push(menuItems[i]);
      }
            
      //page data does not exist, inserting it
      if(!pageData) {
        
        pageData = new PageData(req.body);
        
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
          }
        }
        
        pageData.meta.mIs = mIs;
        
        console.log('saving pageData');
        pageData.save();
      }
              
      Page
      .findOne({slug: pageSlug})
      .exec(function(err, page) {
        
        console.log('loading '+pageSlug);
			
		  console.log(page);
		  
        
        if(!page || !page.body) {
          createPages(pageSlug, function(err, res){
            if(err) res.redirect('4oh4');
          });
        }
                
        res.render('page', {'pageData': pageData, 'page': page});
        return;
        //~ page.remove();
        
      });	
    });
  });    
};

function initMenuItems() {
  
  var mI1 = new MenuItem(req.body);
  mI1.url = "/";mI1.text = "home";mI1.menu = "header";
  mI1.save();
  
  
  var mI2 = new MenuItem(req.body);
  mI2.url = "/about";mI2.text = "about";mI2.menu = "header";
  mI2.save();
  
  var mI3 = new MenuItem(req.body);
  mI3.url = "/impressum";mI3.text = "impressum";mI3.menu = "footer";
  mI3.save();
  
  menuItems.push(mI1).push(mI2).push(mI3);
  
  return menuItems;
}

function createPages(pageSlug, callback) {
  if(pageSlug === '4oh4') {
    Page
    .findOne({slug: '4oh4'})
    .exec(function(err, page) {
      
      if(!page) {
      
      page = new Page();
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
      }
      res.render('page', {'pageData': pageData, 'page': page});
      //~ page.remove();
      callback(null, res);
    });

  }else if(pageSlug === "home" ){
    Page
    .findOne({slug: 'home'})
    .exec(function(err, page) {
      
      if(!page) {
        page = new Page();
        page.title = 'home';
        page.slug = 'home';
        page.body = 'home page body';
        page.footer = 'home page footer';
        page.logo = {
          src: '/images/pagelogos/home.png',
          title: 'page logo home title',
          alt: 'page logo home alt'
        };
        
        page.save();
      }
      
      res.render('page', {'pageData': pageData, 'page': page});
      //~ page.remove();
      callback(null,res);
    });
  }
  callback("page not found", res);
}
