var path = require('path')
  , utils = require(path.join(__dirname, '..', 'base', 'utils'))
  , mongoose = require('mongoose');

exports.init = function(bonobo, cb) {

  bonobo.getPluginSettings = function(pluginSettings, cb) {
      
      if(!pluginSettings || utils.count(pluginSettings) <= 0 ) {
        var err = {message: "settings for the plugin could not be found", css: "fail" };
        
        cb(err, null);
        return;
      }
      
      var Setting = mongoose.model("Setting");
      
      Setting.findOne({slug: utils.slugify(pluginSettings.name.value)}, function(err, setting) {
        
        if(!setting) {
          bonobo.updateOrSavePluginSettings(pluginSettings, cb);
        }else{
          cb(err, null, setting);
        }
      });
    }

    bonobo.updateOrSavePluginSettings = function(pluginSettings, cb) {
      if(!pluginSettings || typeof pluginSettings !== "object") {
        cb({message: 'invalid settings object passed to bonobo.updateOrSavePluginSettings', css: "fail"});
        return;
      }
      
      var errs = []
        , msgs = []
        , Setting = mongoose.model("Setting");
      
      
      Setting.findOne({slug: utils.slugify(pluginSettings.name.value)}, function(err, setting) {
        
        setting = setting || new Setting();
        
        if(err) {
          errs.push({message: err, css: 'fail'});
        }
        
        setting.values = pluginSettings;
        
        setting.save(function(err,msg) {
          
          if(errs.length == 0) {
            msgs.push({message: 'pluginSettings for '+pluginSettings.name.value+' saved successfully', css: 'win'});
          }else{
            errs.push({message: 'pluginSettings for '+pluginSettings.name.value+' saved with errors', css: 'fail'});
          }
                    
          cb(errs, msgs, setting);
        });      
      });
    }
}
