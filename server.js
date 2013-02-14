'use strict';

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , utils = require(path.join(__dirname, 'base', 'utils'))
  , base = require(path.join(__dirname, 'base', 'base'))
  , bonobo = require(path.join(__dirname, 'bonobo', 'bonobo'))
  , msgs = []
  , errs = [];
 

var server = module.exports;

server.rootDir = __dirname;

server.settings = {
  port: '3000',
  debug: true,
  mongodb: {
    url: '127.0.0.1',
    port: '27017',
    db: 'goofy2222222'
  }
};


bonobo.init(path.join(server.rootDir, 'plugins'), function (err, msg) {
  if (err) { utils.each(err, function (err) { errs.push(err); }); }
  if (msg) { utils.each(msg, function (msg) { msgs.push(msg); }); }
    
  bonobo.DoThemModels(function (err, msg) {
    if (err) { utils.each(err, function (err) { errs.push(err); }); }
    if (msg) { utils.each(msg, function (msg) { msgs.push(msg); }); }

    base.config(server, function (err, msg) {
      if (err) { utils.each(err, function (err) { errs.push(err); }); }
      if (msg) { utils.each(msg, function (msg) { msgs.push(msg); }); }

      bonobo.RouteThemAll(base, function (err, msg) {
        if (err) { utils.each(err, function (err) { errs.push(err); }); }
        if (msg) { utils.each(msg, function (msg) { msgs.push(msg); }); }

        //~ base.locals.errors = errs;
        //~ base.locals.messages = msgs;

        if (server.settings.debug) {
          utils.each(errs, function (err) {console.log(err.value.value.message); });

          utils.each(msgs, function (msg) {console.log(msg.value.value.message); });
        }
        
        //start the base server
        if (base) {
          http.createServer(base).listen(server.settings.port, function () {
            console.log('Express server listening on port ' + server.settings.port);
          });
        }
      });
    });
  });
});
