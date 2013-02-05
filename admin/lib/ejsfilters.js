"use strict";


var filters = module.exports = {

  variableInputField: function(value) {
    //~ console.log('filter called with value:');
    //~ console.log(value);
    var val = value.value;
    
    var str = "";
    
    if( val.type === 'bool' || val.type === 'boolean' ){
      var str = '<input name="'+value.key+'" id="'+value.key+'" type="checkbox"';
      
      if(val.value == true) {
        str += ' checked="checked"';
      }
      str += ' />';
    }
    
    if( val.type === "list" ){
      //~ console.log('val.value = ');
      //~ console.log(val.value);
      
      var str = '<label class="desc">'+val.desc+'</label><dl>';
        utils.each(val.value, function(set) {
          str += "<dt>"+set.key+"</dt>"
              +"<dd>"
              + createInputField(set)
              + "</dd>";
        });
      str += "</dl>";
      
      //str will be very different here, return now
      return str;
    }
    if(val.type === "option") {
      var v = val.options;
      
      str = '<select name="'+value.key+'" id="'+value.key+'">';
      utils.each(val.options, function(v) {
        str += '<option value="'+v.value+'">'+v.value+'</option>'
      }
      
    }
    
    if( val.type === "version" ) {
      var v = val.value.split(".");
      //~ 
      //~ console.log('v = ');
      //~ console.log(v);
      utils.each(v, function(vi) {
        //~ console.log('vi = '+vi.value);
        str += '<input class="compact" type="number" maxlength="1" min="0" max="99" value="'+vi.value+'" name="'+vi.key+'" id="'+vi.key+'" />';
      });
    }
    
    if(val.type === "number"){
      str += '<input class="compact" type="number" maxlength="1" min="0" max="99" value="'+val.value+'" name="'+value.key+'" id="'+value.key+'" />';
    }
    
    if( val.type === "textarea" ) {
      //is string or number, or something exotic... more error resolving later
      str = '<textarea name="'+value.key+'" id="'+value.key+'">'+val.value+'</textarea>';
    }
    
    if (str === "" ) {
      //is string or number, or something exotic... more error resolving later
      str = '<input type="text" value="'+val.value+'" name="'+value.key+'" id="'+value.key+'" />';
    }
    
    str += '<label class="desc" for="'+value.key+'">'+val.desc+'</label>';
    
    return str;
  }
};
