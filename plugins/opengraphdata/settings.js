'use strict';

var settings = module.exports = {
    name: {value: 'opengraphdata', type: 'text', desc: 'name of this plugin module'}
  , version: {value: '0.0.1', type: 'version', desc: 'version number of this plugin, please always format 0.0.1'}
  , description: {value: 'opengraphdata will be shown in the header', type: 'textarea', desc: 'the description of this plugin'}
  , setupDone: {value: false, type: 'bool', desc: 'has the setup for this plugin been completed?'}
  , opengraphdata: {
      type: 'list'
    , desc: 'these opengraphdata items will be created on setup'
    , value: {
         title: {
            type: 'list'
          , desc: 'The title of your object as it should appear within the graph, e.g., "The Rock".'
          , value: {
              content: {type: 'text', value: 'og data title', desc: 'this is the tagname of this object'}
              tag: {type: 'text', value: 'og data title', desc: 'this is the content of this tag'}
          }
        } 
        , desc: {
            type: 'list'
          , desc: 'The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "http://www.imdb.com/title/tt0117500/".'
          , value: {
              content: {type: 'textarea', value: 'og data description, can be a longer text too.', desc: 'this is the tagname of this object'}
            , tag: {type: 'text', value: 'og data url', desc: 'this is the content of this tag'}
          }
        }
        ,  type: {
            type: 'list'
          , desc: 'The type of your object, e.g., 'video.movie'. Depending on the type you specify, other properties may also be required.'
          , value: {
              content: {type: 'text', value: 'og data type', desc: 'this is the tagname of this object'}
              tag: {type: 'text', value: 'og data tag', desc: 'this is the content of this tag'}
          }
        }
        , image: {
            type: 'list'
          , desc: 'An image URL which should represent your object within the graph.'
          , value: {
              content: {type: 'text', value: 'og data image', desc: 'this is the tagname of this object'}
              tag: {type: 'text', value: 'og data image', desc: 'this is the content of this tag'}
          }
        }
        , url: {
            type: 'list'
          , desc: 'The canonical URL of your object that will be used as its permanent ID in the graph, e.g., "http://www.imdb.com/title/tt0117500/".'
          , value: {
              content: {type: 'text', value: 'og data url', desc: 'this is the tagname of this object'}
              tag: {type: 'text', value: 'og data url', desc: 'this is the content of this tag'}
          }
        }
      }
    }
  }
};
og:title - The title of your object as it should appear within the graph, e.g., 'The Rock'.
og:type - The type of your object, e.g., 'video.movie'. Depending on the type you specify, other properties may also be required.
og:image - An image URL which should represent your object within the graph.
og:url - The canonical URL of your object that will be used as its permanent ID in the graph, e.g., 'http://www.imdb.com/title/tt0117500/'.
