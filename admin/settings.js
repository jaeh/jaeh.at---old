"use strict";

var settings = module.exports = {
    name: {value: "admin", type: "text", desc: "name of this plugin module"}
  , version: {value: "0.0.1", type: "version", desc: "version number of this plugin, please always format 0.0.1"}
  , description: {value: "admin module", type: "textarea", desc: "the description of this plugin"}
  , setupDone: {value: false, type: "bool", desc: "has the setup for this plugin been completed?"}
};
