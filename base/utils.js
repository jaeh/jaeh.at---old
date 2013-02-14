"use strict";

var utils = module.exports = {


    init : function(rootDir, cb) {
      cb(null, utils);
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
      
      for(var i = 0; i < array.length; i++) {
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
      
      for(var key in arrayOrObject) {
        if (arrayOrObject.hasOwnProperty(key)) count++;
      }
      return count;
    }
  , 
  requestBodyToJSON: function(reqB) {
    //this function takes a one dimensional in object,  
    //in reqB["some-json-object-notation"] = value
    //usually coming from a html form element and converts it into
    //out reqBody.some.json.object.notation = value
    var reqBody = {};
    
    for(var keys in reqB) {
      //reference copy for this single value
      var currentObject = reqBody;
      
      //split the arraykey of the in reqB object
      var keyArr = keys.split('-');
            
      //this request.body object was the submit button
      if(!keyArr[0] || keyArr[0] == 'submit') {continue;}
      
      //loops over the array of keys of this single value
      for(var i = 0; i < keyArr.length; i++ ) {
        //this is the last key, assign the value
        if(i >= keyArr.length -1) {
          currentObject[keyArr[i]] = reqB[keys];
          break;
        }
        //this is not the last key, create the next subobject and retry
        if(!currentObject[keyArr[i]]) { 
          //just creating an empty element to make sure we can assign to this in the next run of the loop
          currentObject[keyArr[i]] = {}
        };
        //make subobject to the object for the next run of the loop
        currentObject = currentObject[keyArr[i]];
      }
    }
    //all objects and subobjects in any depth have been assigned, return them
    return reqBody;
  }
    
}
// TODO old code
      //~ switch(keyArr.length) {
        //~ case 1:
          //~ if(keyArr[0] == 'submit') {break;}
          //~ if(!reqBody[keyArr[0]]) reqBody[keyArr[0]] = {};
          //~ reqBody[keyArr[0]] = reqB[keys];
        //~ break;
        //~ 
        //~ case 2:
          //~ if(!reqBody[keyArr[0]]) reqBody[keyArr[0]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]]) reqBody[keyArr[0]][keyArr[1]] = {};
          //~ 
          //~ reqBody[keyArr[0]][keyArr[1]] = reqB[keys];
        //~ break;
        //~ 
        //~ case 3:
          //~ if(!reqBody[keyArr[0]]) reqBody[keyArr[0]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]]) reqBody[keyArr[0]][keyArr[1]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]][keyArr[2]]) reqBody[keyArr[0]][keyArr[1]][keyArr[2]] = {};
          //~ 
          //~ reqBody[keyArr[0]][keyArr[1]][keyArr[2]] = reqB[keys];
        //~ break;
        //~ 
        //~ case 4:
        //~ 
          //~ if(!reqBody[keyArr[0]]) reqBody[keyArr[0]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]]) reqBody[keyArr[0]][keyArr[1]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]][keyArr[2]]) reqBody[keyArr[0]][keyArr[1]][keyArr[2]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]]) reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]] = {};
          //~ 
          //~ reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]] = reqB[keys];
        //~ break;
        //~ 
        //~ case 5:
        //~ 
          //~ if(!reqBody[keyArr[0]]) reqBody[keyArr[0]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]]) reqBody[keyArr[0]][keyArr[1]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]][keyArr[2]]) reqBody[keyArr[0]][keyArr[1]][keyArr[2]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]]) reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]] = {};
          //~ if(!reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]][keyArr[4]]) reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]][keyArr[4]] = {};
          //~ 
          //~ reqBody[keyArr[0]][keyArr[1]][keyArr[2]][keyArr[3]][keyArr[4]] = reqB[keys];
        //~ break;
        //~ 
