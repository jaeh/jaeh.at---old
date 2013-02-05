"use strict";


var path = require('path');

var settings = module.exports = {
  
  pageData: {
    title       : 'jaeh.at'
    , footer    : 'main page footer'
    , appname   : 'base'
    , slug      : 'jaeh_at'
    , logo      : '/images/logo.png'
    , meta      : {
          og : {
            "title": "jaeh.at"
          }
        , aside : {
            title: "aside title",
            body: "aside body",
            widgets: [
              { name: "widget 1", title: "widget title", body: "widget body content"},
              { name: "widget 2", title: "widget 2 title", body: "widget 2 body content"} 
            ]
          }
        , mIs : {
            header: [
              { url: "/", text: "home", menu: "header"},
              { url: "/about", text: "about", menu: "header"}
            ],
            footer: [
              { url: "/impressum", text: "impressum", menu: "footer"}
            ]
          }

      }
  }
}
