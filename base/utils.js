"use strict";

var utils = module.exports = {


    init : function(rootDir, cb) {
      cb(null, utils);
    }

  , getObjectLength : function(obj) {
      var size = 0
        , key;
      
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      
      return size;
    }


  , slugify : function(slug) {
    
    if(slug) {
      //first replace spaces with underscores and lowercase the slug
      slug = slug.replace(/\s/g, '_').toLowerCase();

      //replace äüö with ae ue and oe for german titles
      //later add support for more/other special chars defined in the admin interface 
      //removing the need of adding them all here and always test against those that we need to test against
      slug = slug.replace(/[\u00e4|\u00fc|\u00f6|\u00df]/g, function($0) { return MCMS.special_chars[$0] });

      //remove all remaining specialchars, i dont like multiple underscores, so replace with nothing?
      slug = slug.replace(/[^a-z0-9_]+/g, '');

      return slug;
    }
  }

  , getVersionNumber : function(versionString) {
      
      if(!versionString) {
        console.log('utils.getVersionNumber needs to get passed version string to work');
      }
      
      var versions = versionString.split('.');
      
      if(!versions) {
        console.log('utils.getVersionNumber needs a versionnumber in the x.x.x format.');
      }
      
      var versionNumber = 0;
      
      var multiplier = 1000;

      
      for(var i = 0; i < versions.length; i++) {

        var ver = parseInt(versions[i]);
        //~ console.log("ver ="+ver * multiplier);
        versionNumber += ver * multiplier;
        multiplier *= 0.1;
      }
      
      return versionNumber;
    }
  
  , each: function(arrayOrObject, cb) {
           
      var array = [];
                
      for(var key in arrayOrObject) {
        array.push( {
          value: arrayOrObject[key],
          key: key
        });
        
      }  
      
      for(var i = 0; i < array.length; i++){
        cb(array[i]);
      }
    }
  
  
  , exists: function(obj) {
      if(typeof obj != undefined) {
        return obj;
      }
      return false;
    }
  
  , count: function(arrayOrObject) {
      //~ console.log('typeof = '+typeof arrayOrObject);
      
      if(typeof arrayOrObject !== 'array' && typeof arrayOrObject !== 'object') {
        return -1;
      }
      
      var count = 0;
      for(var i in arrayOrObject) {
        count++;
      }
      return count;
    }
}
