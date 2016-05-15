define([], function() {
  "use strict";

  return {
    tables: [
      {
        name: "user",
        fields: [
          {
            name: "id",
            type: "integer",
            primaryKey: true
          },
          {
            name: "userName",
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
      },
      {
        name: "notification",
        fields: [
          {
            name: "id",
            type: "integer",
            primaryKey: true
          },
          {
            name: "type",
            type: "integer"
          },
          {
            name: "title",
            type: "text"
          },
          {
            name: "content",
            type: "text"
          },
          {
            name: "read",
            type: "integer"
          }
        ]
      },
      {
        name: "bloodSaturation",
        fields: [
          {
            name: "id",
            type: "integer",
            primaryKey: true
          },
          {
            name: "date",
            type: "text"
          },
          {
            name: "value",
            type: "integer"
          }
        ]
      }
    ]
  };
});
