'use strict';

var settings = module.exports = {
    name: {value: 'opengraphdata', type: 'text', desc: 'name of this plugin module'}
  , version: {value: '0.0.1', type: 'version', desc: 'version number of this plugin, please always format 0.0.1'}
  , description: {value: 'opengraphdata will be shown in the header', type: 'textarea', desc: 'the description of this plugin'}
  , setupDone: {value: false, type: 'bool', desc: 'has the setup for this plugin been completed?'}
  , published: {value: false, type: "bool", desc: "is this plugin active?"}
  , opengraphdata: {
      type: 'list'
    , desc: 'these opengraphdata items will be created on setup'
    , value: {
        image: {
          type: 'list'
        , desc: 'An image URL which should represent the image of your object within the graph.'
        , value: {
            children: {
              type: 'list'
            , desc: 'a list of subitems that belong to the image tag'
            , value: {
               image_mimetype: {
                  type: 'list'
                , desc: 'The mimetype of the image, eg image/png.'
                , value: {
                    content: {type: 'text', value: 'image/png', desc: 'this is the content of this tag'}
                  , tag: {type: 'text', value: 'image', desc: 'this is the tagname of this tag'}
                }
              }
              , image_height: {
                  type: 'list'
                , desc: 'The Height of the image'
                , value: {
                    content: {type: 'text', value: '300', desc: 'this is the content of this tag'}
                  , tag: {type: 'text', value: 'image:height', desc: 'this is the tagname of this tag'}
                }
              }
              , image_width: {
                  type: 'list'
                , desc: 'The width of the image, eg 300.'
                , value: {
                    content: {type: 'text', value: '300', desc: 'this is the content of this tag'}
                  , tag: {type: 'text', value: 'image:width', desc: 'this is the tagname of this tag'}
                }
              }
            }
          }
          , content: {type: 'text', value: 'http://dev:3000/images/og_image.png', desc: 'this is the content of this tag'}
          , tag: {type: 'text', value: 'image', desc: 'this is the tagname of this tag'}
        }
      }
      , desc: {
          type: 'list'
        , desc: 'The description of your object'
        , value: {
            content: {type: 'textarea', value: 'og data description, can be a longer text too.', desc: 'this is the content of this tag'}
          , tag: {type: 'text', value: 'url', desc: 'this is the tagname of this tag'}
        }
      }
      , url: {
          type: 'list'
        , desc: 'The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "http://jaeh.at/posts/post_title/".'
        , value: {
            content: {type: 'text', value: 'og data url', desc: 'this is the content of this tag'}
          , tag: {type: 'text', value: 'og data url', desc: 'this is the tagname of this tag'}
        }
      }
      ,  type: {
          type: 'list'
        , desc: 'The type of your object, e.g., "video.movie". Depending on the type you specify, other properties may also be required.'
        , value: {
            content: {type: 'text', value: 'og data tag', desc: 'this is the content of this tag'}
          , tag: {type: 'text', value: 'data', desc: 'this is the tagname of this tag'}
        }
      }
      ,  title: {
          type: 'list'
        , desc: 'The title of your object as it should appear within the graph, e.g., "The Rock".'
        , value: {
            tag: {type: 'text', value: 'title', desc: 'this is the tagname of this tag'}
          , content: {type: 'text', value: 'og data title', desc: 'this is the content of this tag'}
        }
      }
    }
  }
}
