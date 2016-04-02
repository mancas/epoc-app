define([], function() {
  "use strict";

  return {
    tables: [
      {
        name: "User",
        fields: [
          {
            name: "id",
            type: "integer",
            primaryKey: true
          },
          {
            name: "name",
            type: "text"
          },
          {
            name: "gradeEPOC",
            type: "text"
          },
          {
            name: "lastRevision",
            type: "text"
          },
          {
            name: "isSmoker",
            type: "integer"
          },
          {
            name: "weight",
            type: "integer"
          },
          {
            name: "height",
            type: "integer"
          },
          {
            name: "birth",
            type: "text"
          }
        ]
      }
    ]
  };
});
