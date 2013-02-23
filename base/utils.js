"use strict";

var utils = module.exports = {


    init : function(rootDir, cb) {
      cb(null, utils);
    }


  , slugify : function(slug) {
    
    if(slug) {
      //first replace spaces with underscores and lowercase the slug
      slug = slug.replace(/\s/g, '_').toLowerCase();

      //replace ae ue oe and ss for german titles
      //later add support for more/other special chars defined in the admin interface 
      //removing the need of adding them all here and always only test against those that we need to test against
      var specialChars = ["ae", "ue", "oe", "ss"];
      
      slug = slug.replace(/[\u00e4|\u00fc|\u00f6|\u00df]/g, function(idx) { return specialChars[idx] });

      //remove all remaining specialchars, i dont like multiple underscores, so replace with nothing this time around.
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
  
  , deprecated_each: function(arrayOrObject, cb) {
           
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
  
  
  , each: function(arrayOrObject, cb) {
           
      var array = []
        , i = 0
        , last = false;
                
      for(var key in arrayOrObject) {
        i++;
        
        last = (i >= utils.count(arrayOrObject));
        
        cb(key, arrayOrObject[key]);
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
      var currentObject = reqBody;               //reference copy for this iteration
      
      var keyArr = keys.split('-');              //split the arraykey of the in reqB object
            
      if(!keyArr[0] || keyArr[0] == 'submit') {  //this request.body object was the submit button
        continue;
      }
      
      for(var i = 0; i < keyArr.length; i++ ) {   //loops over the array of keys of this single value

        if(i >= keyArr.length -1) {               //this is the last key
          currentObject[keyArr[i]] = reqB[keys];  //assign the value
          break;
        }
        
        if(!currentObject[keyArr[i]]) {           //this is not the last key
          currentObject[keyArr[i]] = {};          //so we create an empty element to make sure we can assign to this in the next iteration
        };
        
        currentObject = currentObject[keyArr[i]]; //make subobject to the object for the next iteration
      }
    }
    return reqBody;                               //all objects and subobjects in any depth have been assigned, return them    
  }
  ,
  log : function(text){
    console.log(text);
  }
  ,
  jsonToMongo: function(setting) {              //this function maps settings.js files to mongodb setting objects.
    var mongoObject = {};             
    
    for(var key in setting) {
      if(typeof setting[key].value !== "undefined") {
        mongoObject[key] = setting[key].value;
      }
    }
    
    return mongoObject;
  }
  ,
  MongoToJSON: function(settings, setting) {
    for(var key in setting) {
      if(!settings.value[key]) settings.value[key] = {};
      
      settings.value[key].value = setting[key];
      
    }
    
    return settings;
  }
  ,
  getErrs: function(errs,err) {                     //get the new error array and return it
    if(utils.count(err)>0) {
      for(var key in err) {
        if(typeof err[key] === "object" ){
          errs.push(err[key]);
        }
      }
    }
    return errs;
  }
  ,
  getMsgs: function(msgs,msg) {                     //get the new msg array and return it
    if(utils.count(msg)>0) {
      for(var key in msg) {
        if(typeof msg[key] === "object" ){
          msgs.push(msg[key]);
        }
      }
    }
    return msgs;
  }  
  ,
  matchInArray: function(needle, heystack) {
    for (var j=0; j < heystack.length; j++) {
        if (heystack[j].match (needle)) return j;
    }
    return -1;
  }
}
