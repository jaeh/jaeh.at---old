"use strict";

var settings = module.exports = {
    name: {value: "admin", type: "text", desc: "name of this plugin module"}
  , version: {value: "0.0.1", type: "version", desc: "version number of this plugin, please always format 0.0.1"}
  , description: {value: "admin module", type: "textarea", desc: "the description of this plugin"}
  , setupDone: {value: false, type: "bool", desc: "has the setup for this plugin been completed?"}
  , mIs: {
      type: "list"
    , desc: "these menuitems will be created on setup"
    , value: {
        posts: {
          type: "list"
        , desc: "the posts menu item"
        , value: { 
            url: {value: "/posts", type: "text", desc: "the target url"}
          , text: {value: "posts", type: "text", desc: "the link text"}
          , menu: {value: "header", type: "text", desc: "the menu this link should appear in"}
          , pos: {value: 3, type: "number", desc: "the position priority this link has, 0 = highest, n = lowest"}
          , published: {value: true, type: "bool", desc: "will this be shown in menus?"}
        }
      }
    }
  }
};
