'use strict';

var settings = module.exports = {
    name: {value: 'auth', type: 'text', desc: 'name of this plugin module'}
  , version: {value: '0.0.1', type: 'version', desc: 'version number of this plugin, please always format 0.0.1'}
  , description: {value: 'the auth module, includes user registration, login, logout, emailconfirm and so on', type: 'textarea', desc: 'the description of this plugin'}
  , setupDone: {value: false, type: 'bool', desc: 'has the setup for this plugin been completed?'}
  , published: {value: true, type: "bool", desc: "is this plugin active?"}
};

