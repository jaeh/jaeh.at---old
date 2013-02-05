var settings = module.exports = {
    name: {value: 'posts', type: "text", desc: "the name of this plugin"}
  , version: {value: '0.0.1', type: "version", desc: "the version number of this plugin"}
  , setupDone: {value: false, type: "bool", desc: "has the setup for this plugin been completed?"}
  , pagination: {
        value: {
          show: { 
              value: {
                  count: { value: true, type: "bool", desc: "show the count of total pages" }
                , above: {value: true, type: "bool", desc: "show the pagination above the posts list" }
                , below: {value: true, type: "bool", desc: "show the pagination below the posts list" }
                , perpage: {value: 10, type: "number", desc: "how many posts per page should be displayed?" }
              }
            , type: "list"
            , desc: "various variables that change the visibility of paginated items and the pagination menu"
          }
        }
      , type: "list"
      , desc: "this variables control the pagination settings."
    }
  , post_list: {
        value: { 
          show: {
            value: {
                date: { value: true, type: "bool", desc: "show the date of publishing in the header of the post"}
              , author: { 
                    value: {
                        show: { value: true, type: "bool", desc: "show the creator of the post"}
                      , vcard: { 
                          value: {
                              show: { value: true, type: "bool", desc: "show the vcard (true) or show the name only (false)"}
                            , position: { value: "above", type: "option", options: ["above", "below"], desc: "show the vcard above or below the post (only valid if vcard selected)"}
                          }
                        }
                    }
                  , type: "list"
                  , desc: "some options to change the display of the post author"
                }
            }
          }
        }
      , type: "list"
      , desc: "handles the display of posts in lists with multiple posts"
    }
  , post_single: {
        value: { 
          show: {
            value: {
                date: { value: true, type: "bool", desc: "show the date of publishing in the header of the post"}
              , author: { 
                    value: {
                        show: { value: true, type: "bool", desc: "show the creator of the post"}
                      , vcard: { 
                          value: {
                              show: { value: true, type: "bool", desc: "show the vcard (true) or show the name only (false)"}
                            , position: { value: "above", type: "option", options: ["above", "below"], desc: "show the vcard above or below the post (only valid if vcard selected)"}
                          }
                        }
                    }
                  , type: "list"
                  , desc: "some options to change the display of the post author"
                }
            }
          }
        }
      , type: "list"
      , desc: "handles the display of single posts"
    }
};
