"use strict";

var settings = module.exports = {
    name: {value: "admin", type: "text", desc: "name of this plugin module"}
  , version: {value: "0.0.1", type: "version", desc: "version number of this plugin, please always format 0.0.1"}
  , description: {value: "admin module", type: "textarea", desc: "the description of this plugin"}
  , setupDone: {value: false, type: "bool", desc: "has the setup for this plugin been completed?"}
  , published: {value: false, type: "bool", desc: "is this plugin active?"}
  , autoSetup : {value: true, type: "bool", desc: "should this plugin be installed automatically?"}
  , mIs: {
      type: "list"
    , desc: "these menuitems will be created on setup"
    , value: {
        admin: {
          type: "list"
        , desc: "the admin main menu item"
        , value: { 
            url: {value: "/admin", type: "text", desc: "the target url"}
          , text: {value: "admin", type: "text", desc: "the link text"}
          , menu: {value: "adminheader", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 1, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
      , plugins: {
          type: "list"
        , desc: "the options main menu item"
        , value: { 
            url: {value: "/admin/plugins", type: "text", desc: "the target url"}
          , text: {value: "plugins", type: "text", desc: "the link text"}
          , menu: {value: "adminheader", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 2, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
      , mongodb: {
          type: "list"
        , desc: "the mongodb main menu item"
        , value: { 
            url: {value: "/admin/mongodb", type: "text", desc: "the target url"}
          , text: {value: "mongodb", type: "text", desc: "the link text"}
          , menu: {value: "adminheader", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 3, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
    }
  }
};
