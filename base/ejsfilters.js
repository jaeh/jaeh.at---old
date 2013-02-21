"use strict";

var path = require('path')
  , moment = require('moment')
  , ejs = require('ejs')
  , utils = require(path.join(__dirname, 'utils'));

var filters = module.exports = function() {
  ejs.filters.momentize = function(date){
    //~ return moment(date).fromNow();
    return date;
  }
  
  //~ ejs.filters.variableInputField = createInputField;
  
}

function createInputField(value) {

  //~ console.log('filter called with value:');
  //~ console.log(value);
  var val = value.value;
  
  var str = "";
  
  if( val.type === 'bool' || val.type === 'boolean' ){
    var str = '<input name="'+value.key+'-'+val.key+'" id="'+value.key+'-'+val.key+'" type="checkbox"';
    
    if(val.value == true) {
      str += ' checked="checked"';
    }
    str += ' />';
  }
  
  if( val.type === "list" ){
    
    var str = '<label class="desc">'+val.desc+'</label><table><tbody>';
      utils.deprecated_each(val.value, function(set) {
        str += "<tr>"
            + "<td>"+set.key+":</td><td>"
            + createInputField(set)
            + "</td></tr>";
      });
    str += "</tbody></table>";
    
    //str will be very different here, return now
    return str;
  }
  if(val.type === "option") {
    var v = val.options;
    
    str = '<select name="'+value.key+'-'+val.key+'" id="'+value.key+'-'+val.key+'">';
    utils.deprecated_each(val.options, function(v) {
      str += '<option value="'+v.value+'">'+v.value+'</option>'
    });
    
  }
  
  if( val.type === "version" ) {
    var v = val.value.split(".");
    
    utils.deprecated_each(v, function(vi) {
      
      str += '<input class="compact" type="number" maxlength="1" min="0" max="99" value="'+vi.value+'" name="'+value.key+'-'+vi.key+'" id="'+value.key+'-'+vi.key+'" />';
    });
  }
  
  if(val.type === "number"){
    str += '<input class="compact" type="number" maxlength="1" min="0" max="99" value="'+val.value+'" name="'+value.key+'-'+val.key+'" id="'+value.key+'-'+val.key+'" />';
  }
  
  if( val.type === "textarea" ) {
    //is string or number, or something exotic... more error resolving later
    str = '<textarea name="'+value.key+'-'+val.key+'" id="'+value.key+'-'+val.key+'">'+val.value+'</textarea>';
  }
  
  if (str === "" ) {
    //is string or number, or something exotic... more error resolving later
    str = '<input type="text" value="'+val.value+'" name="'+value.key+'-'+val.key+'" id="'+value.key+'-'+val.key+'" />';
  }
  
  str += '<label class="desc" for="'+value.key+'-'+val.key+'">'+val.desc+'</label>';
  
  return str;
}
