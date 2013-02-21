"use strict";


var path = require('path');

var settings = module.exports = {
  
  pageData: {
      type: "list"
    , desc: "the pageData is the central collection of customized strings that are being used at every pageload"
    , value: {
        title     : {value: 'jaeh.at', type: "text", desc: "this value is being used in numerous places to display the name of this page"}
      , footer    : {value: 'main page footer', type: 'text', desc: 'this is the main page footer, shown on every page'}
      , appname   : {value: 'base', type: 'text', desc: 'the name of this application for database requests'}
      , logo      : {
          type: 'imagelist'
        , desc: 'the main page logo, if not set the title will be used instead'
        , value: {
            src   : { desc: "the url src of the logo, can be relative or absolute", type: "text", value: '/images/logo.png'}
          , alt   : { desc: "the alt of the logo, will be shown if no image file is found", type: "text", value: "jaeh.at"}
          , title : { desc: "the title of the logo, will be shown when the logo is hovered", type: "text", value: "jaeh.at"}
          }
        }
      
      , version   : {value: '0.0.1', type: "version", desc: 'the version number of the pageData.'}
      , meta      : {
          type: "list"
        , desc: "the metadata of the pageData"
        , value: {
            og : {
              type: "list"
            , desc: "opengraphdata that will be loaded in the header"
            , value: {
                title: {value: "jaeh.at", type: "text", desc: "the title for the opengraphdata in the header"}
            }
          }
          , aside : {
              type: "list"
            , desc: "this are the basevalues for the sidebar. leave empty to not show any of them."
            , value: {
                title: {value: "aside title", type: "text", desc: "the title of the sidebar"}
              , body: {value: "aside body", type: "text", desc: "the body of the sidebar"}
            }
          }
        }
      }
    }
  }
  , mIs: {
      type: "list"
    , desc: "the menuitems for the different menus"
    , value: {
        home: {
          type: "list"
        , desc: "the home menu item"
        , value: { 
            url: {value: "/", type: "text", desc: "the target url"}
          , text: {value: "home", type: "text", desc: "the link text"}
          , menu: {value: "header", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 1, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
      , about: {
          type: "list"
        , desc: "the about menu item, for now only used to test 4oh4 behaviour"
        , value: { 
            url: {value: "/about", type: "text", desc: "the target url"}
          , text: {value: "about", type: "text", desc: "the link text"}
          , menu: {value: "header", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 2, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
      , impressum: {
          type: "list" 
        , desc: "the impressum menu item, will be loaded in the footer"
        , value: { 
            url: {value: "/impressum", type: "text", desc: "the target url"}
          , text: {value: "impressum", type: "text", desc: "the link text"}
          , menu: {value: "footer", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 1, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
    }
  }
  , pages: {
      type: "list"
    , desc: "the pages that will be created on setup."
    , value: {
        "4oh4": { 
          type: "list"
        , desc: "this is the 4oh4 page. it is shown when a user tries to view a url that doesnt exist or if something goes wrong."
        , value: {
            title : {value: '4oh4', type: "text", desc: "the page title"}
          , body  : {value: '4oh4 page body', type: "textarea", desc: "the page body"}
          , footer: {value: '4oh4 page footer', type: "textarea", desc: "the page footer"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
          , logo  : {
              type: "imagelist"
            , desc: "the logo data for this page, leave blank if not needed"
            , value: {
                src: {value: '/images/pagelogos/4oh4.png', type: "text", desc: "the link to the image"}
              , title: {value: '4oh4 logo title', type: "text", desc: "the hover title of the image"}
              , alt: {value: '4oh logo alt', type: "text", desc: "the alternative text of the image"}
            }
          }
        }
      }
      , home: {
          type: "list"
        , desc: "this is the home page, it will be the first entry point for most users."
        , value: {
            title : {value: 'home', type: "text", desc: "the page title"}
          , body  : {value: 'home page body', type: "textarea", desc: "the page body"}
          , footer: {value: 'home page footer', type: "textarea", desc: "the page footer"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
          , logo  : {
              type: "imagelist"
            , desc: "the logo data for this page, leave blank if not needed"
            , value: {
                src: {value: '/images/pagelogos/home.png', type: "text", desc: "the link to the image"}
              , title: {value: 'home logo title', type: "text", desc: "the hover title of the image"}
              , alt: {value: 'home logo alt', type: "text", desc: "the alternative text of the image"}
            }
          }
        }
      }
    }
  }
  //~ , special_chars: {
      //~ type: "list"
    //~ , desc: "special chars for your language should be defined here, along with replacements that are valid in urls"
    //~ , value: {
        //~ type: "list"
      //~ , desc: "these are the actual special_chars"
      //~ , value: {
          //~ ae: {value: "\u00df"
      //~ }
    //~ }
  //~ }
}
