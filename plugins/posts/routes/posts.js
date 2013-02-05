"use strict";


var mongoose = require('mongoose')
  , Post = mongoose.model("Post")
  , path = require('path')
  , settings = require(path.join(__dirname, '../settings'));

var routes = module.exports = {};

routes.posts = function(req, res, next) {
  var queryObject = {};
  
  //~ console.log(query.count());
  Post.count({}, function(err, count) {
    if(err) next(err);
    
    var postsPerPage = parseInt(settings.pagination.value.show.value.perpage.value);
    
    var skipFrom = 0
      , pageIndex = 0;
  
    if(req.params && req.params.pagination) {
      pageIndex = parseInt(req.params.pagination);
      skipFrom = parseInt(postsPerPage) * parseInt(req.params.pagination);
    }
    
    //~ console.log('pageIndex:'+pageIndex+' skipFrom ='+skipFrom+"  count="+count);
    
    Post
    .find({}).limit(postsPerPage).skip(skipFrom).sort("-createdAt")
    .exec(function(err, posts) {
      
      
      var prevUrlTarget = pageIndex -1;
      
      if(prevUrlTarget <= 0 ) {
        prevUrlTarget = ''
      }
      
      
      var countEnd = skipFrom + postsPerPage -1;
      
      if(countEnd > count ){
        countEnd = count;
      }
          
      var currentPaginationPage = (skipFrom / postsPerPage) + 1;
      
      var endPaginationPage = parseInt(count / postsPerPage);
      
      var modulo = count % postsPerPage;
      //~ 
      //~ console.log('modulo ='+modulo);
      if( modulo > 0 ){
        endPaginationPage++;
      }
      //~ console.log('skipFrom ='+skipFrom+' count ='+count);
          
      var pagination = {
            prev: {
                show: skipFrom > 0
              , text: 'previous'
              , url: '/posts/'+prevUrlTarget
            }
            
          , next: {
                show: skipFrom + postsPerPage < count
              , text: 'next'
              , url: '/posts/'+(parseInt(pageIndex) + 1)
            }
            
          , count: {
                show: settings.pagination.value.show.value.count.value || true
              , current: currentPaginationPage
              , end: endPaginationPage
            }
          , above: {
                show: settings.pagination.value.show.value.above.value || true
          }
          , below: {
                show: settings.pagination.value.show.value.below.value || true
          }
      };
      
      var show = {
          date: settings.post_list.value.show.value.date.value || true
        , author: {
              show: settings.post_list.value.show.value.author.value.show.value || true
            , vcard: settings.post_list.value.show.value.author.value.vcard.value.show.value || true
            , position: settings.post_list.value.show.value.author.value.vcard.value.position.value || "above"
        }
      }
      
      res.render('posts/posts', {posts: posts, pagination: pagination, show: show});
      return;
      
    });
  });
}


routes.post = function(req, res, next) {
  if(!req.params || !req.params.slug) {
    res.redirect('/posts');
    return;
  }

  Post
  .findOne({slug: req.params.slug})
  .exec(function(err, post) {
    
    if(!post) {
      next();
      return;
    }
    
    
    res.render('posts/post', {post: post});
    return;
    
  });
}
