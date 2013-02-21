dry-kiss
=======

dont repeat yourself - keep it simple stupid.


a cms based on expressjs, mongoose, ejs, stylus, mongoose and some other goodies. dry kiss should be the principle...

modules:
  base: main module, handles:
    pageData: (data that should be available for every request),
    pages: "static" pages, with content loaded from mongodb and templating using ejs templating and the stylus css preprocessor
    utils: helper functions that deal with common tasks (utils.count counts objects and arrays, utils.each does an each loop with a callback and so on)
    
  bonobo: plugin handler:
    setup           : handles plugin setup
  , middleware      : executes plugin middleware in base.use
  , models          : requires and inits all mongoose models of base and all plugins
  , routes          : sets up routes for the plugins and the base
  , pluginsettings  : various helpers to deal with getting, setting and updating pluginsettings from/in the db
  , menuitems       : helpers to get the menuitems from all plugins.
  
  
  plugins:
    posts: adds rudimentary post support,
    admin: adds rudimentary admin support, settings pages are already getable, not postable
    auth: adds passport-authentication and user registration
    opengraphdata: adds og:tags to the header of the page
    
  various other goodies
  
  
using drykiss:
you obviously need nodejs, i always tend to use the newest stable.
mongodb must be installed and running too.

then just create a fork,
 
    git clonehttps://github.com/yourusername/drykiss.git
    
    npm install
    
    node server.js
    
enjoy. (allthough i am not too sure if this piece of software is enjoyable. yet.) ;)
