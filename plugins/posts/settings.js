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
};
