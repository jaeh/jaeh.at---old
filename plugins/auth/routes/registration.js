"use strict";

var mongoose          = require('mongoose')
  , path              = require('path')
  , SHA512            = new(require('jshashes').SHA512)()
  , auth              = require(path.join(__dirname, '..'));


var routes = module.exports = {
    gets: {},
    posts: {}
};

routes.posts.registration = function(req, res) {
  
  var template = 'auth/registration';


  var returner = {
    success: false,
    error: false,
    errors: {}
  }
  
  if(!req.body.name){
    returner.errors.noname = returner.error = true;
  }
  
  if(!req.body.email){
    returner.errors.noemail = returner.error =true;
  }
  
  if(!req.body.password){
    returner.errors.nopassword = returner.error = true;  
  }

  console.log('registering in user req.body =');
  console.log(req.body);
  
  if(req.body && !returner.error) {
    
    var UserRegistration  = mongoose.model('UserRegistration')
      , User              = mongoose.model('User')
      
    
    User.findOne({$or: [ { name: req.body.name }, { email: req.body.email } ]}, "email", function(err, user) {
      UserRegistration.findOne({$or: [ { name: req.body.name }, { email: req.body.email } ]}, "email", function(err, userReg) {
  
        if(user || userReg) {
          
          returner.errors.userExists = true;
          res.render( template, returner);
          return;
        }
        
        var userRegistration = new UserRegistration();
        
        userRegistration.name = req.body.name;
        userRegistration.email = req.body.email;
        
        userRegistration.password = req.body.password;
        
        //request has not been sent by javascript, password is not encrypted
        if(!req.body.js) {
          //~ userRegistration.password = SHA512.b64_hmac(req.body.password, auth.SHA512SALT);
        }
        
        userRegistration.random = parseInt(Math.random() * 1000000000000000);
                
        userRegistration.save(function(err, userReg) {
          if(err) throw err;
          
          res.redirect('registration/confirm/'+userRegistration.random);
          
        });
      });
    });
  }else{
    res.render( template, returner);
  }
}


routes.posts.registrationConfirm = function(req, res) {
  var template = 'auth/registration/confirm';
  
  var returner = {
    success: false,
    error: false,
    errors: {}
  }
  
  //~ console.log('req.body =');
  //~ console.log(req.body);
  
  if(!req.body || !req.body.email) {    
    if(!req.body.email && !req.params.email){
      returner.errors.noemail = returner.error = true;
    }
    
    if(!req.body.code && !req.params.code) {
      returner.errors.norandom = returner.error = true;
    }
  }
  
  
  
  if(!returner.error) {
    //~ console.log("got a code and an email");
    UserRegistration.findOne({email: req.body.email, random: req.body.random}, "name email password", function(err, userReg) {
      //~ console.log('userReg in registrationconfirm found with err:'+err+" queryparams: email="+req.body.email+"  random: "+req.body.random);
      //~ console.log(userReg);
      
      if(userReg) {
        var user = new User();
        
        user.name = userReg.name;
        user.email = userReg.email;
        user.password = userReg.password;
        user.createdAt = userReg.createdAt;
        
        user.save(function(err) {
          userReg.remove();
                    
          //~ console.log('user should be logged in now... redirecting to user account now');
          
          //~ res.redirect('user/'+user.name);
          req.login(user, function(err) {
            if (err) { return next(err); }
            
            
            return res.redirect('/user/' + req.user.name);
          });
        });
      }else{
        returner.errors.nouser = true;
        res.render(template, returner);
      }
    });
    
  }else{
    res.render(template, returner);
  }
}


