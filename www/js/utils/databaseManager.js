define(["db"], function(DataBaseSchema) {
  "use strict";

  const DBNAME = "epoc.db";
  const SQL_WORDS = {
    CREATE_TABLE: "CREATE TABLE IF NOT EXISTS ",
    PRIMARY_KEY: "PRIMARY KEY",
    INSERT: "INSERT INTO ",
    VALUES: "VALUES ",
    UPDATE: "UPDATE ",
    SET: "SET ",
    WHERE: "WHERE ",
    AND: "AND",
    OR: "OR",
    SELECT: "SELECT ",
    FROM: "FROM "
  };

  var dbManager = {
    db: null,
    sqlQueue: [],
    working: false,

    openDatabase: function (successCb, errorCb) {
      window.sqlitePlugin.openDatabase({
        name: DBNAME,
        location: 0
      }, function(db) {
        this.db = db;
        this.createTablesIfNeeded();
      }.bind(this), errorCb);
    },

    close: function() {
      if (this.db) {
        this.db.close();
      }
    },

    createTablesIfNeeded: function() {
      var tables = DataBaseSchema.tables;
      for (var table in tables) {
        if (!table.hasOwnProperty("name")) {
          throw new Error("Cannot create a table without a name");
        }
        var statement = SQL_WORDS.CREATE_TABLE + table.name + " (";
        table.fields.forEach(function(field, index) {
          statement += field.name + " " + field.type;
          if (field.hasOwnProperty("primaryKey")) {
            statement += " " + SQL_WORDS.PRIMARY_KEY;
          }

          if (index !== table.fields.length - 1) {
            statement += ", ";
          }
        });
        statement += ")";

        this._queueSQL(statement);
      }
    },

    insert: function(tableName, values) {
      if (!values) {
        throw new Error("Values are needed to execute an insert operation");
      }

      var statement = SQL_WORDS.INSERT + tableName + " (";
      var statementValues = [];
      var objKeys = Object.keys(values);
      var statementParams = "(";
      objKeys.forEach(function(field, index) {
        statementValues.push(values[field]);
        statement += field;
        statementParams += "?";
        if (index !== objKeys.length - 1) {
          statement += ", ";
          statementParams += ", ";
        }
      });
      statement += ")" + SQL_WORDS.VALUES + statementParams + ")";

      this._queueSQL(statement, statementValues);
    },

    update: function(tableName, values, where) {
      if (!values) {
        throw new Error("Values are needed to execute an update operation");
      }

      var statement = SQL_WORDS.UPDATE + tableName + " " + SQL_WORDS.SET;
      var statementValues = [];
      var objKeys = Object.keys(values);
      objKeys.forEach(function(field, index) {
        statementValues.push(values[field]);
        statement += field + "=?";
        if (index !== objKeys.length - 1) {
          statement += ", ";
        }
      });
      statement += " " + SQL_WORDS.WHERE;

      if (!where) {
        statement += "1";
      } else {
        statement += where;
      }

      this._queueSQL(statement, statementValues);
    },

    select: function(tableName, fields, where) {
      fields = fields || "*";

      var statement = SQL_WORDS.SELECT + fields.toString() + " " + SQL_WORDS.FROM + tableName;

      if (where) {
        statement += " " + SQL_WORDS.WHERE + where;
      }

      this._queueSQL(statement);
    },

    createWhereBuilder: function() {
      return {
        where: "",

        and: function(values) {
          var objKeys = Object.keys(values);
          objKeys.forEach(function(field, index) {
            this.where += field + "=" + values[field];
            if (index !== objKeys.length - 1) {
              this.where += " " + SQL_WORDS.AND;
            }
          }.bind(this));

          return this.where;
        },

        or: function(values) {
          var objKeys = Object.keys(values);
          objKeys.forEach(function(field, index) {
            this.where += field + "=" + values[field];
            if (index !== objKeys.length - 1) {
              this.where += " " + SQL_WORDS.OR;
            }
          }.bind(this));

          return this.where;
        }
      }
    },

    _queueSQL: function(statement, params) {
      this.sqlQueue.push({
        statement: statement,
        params: params || []
      });
      this._executeSQL();
    },

    _executeSQL: function() {
      if (this.working || !this.sqlQueue.length) {
        return;
      }

      this.working = true;
      var nextStatement = this.sqlQueue.shift();
      var self = this;
      console.info("DATABASEMANAGER: Executing sql statement: " + nextStatement.statement);
      console.info("DATABASEMANAGER: With params", nextStatement.params);
      this.db.transaction(function(tx) {
        tx.executeSql(nextStatement.statement, nextStatement.params, function() {
          self.working = false;
          self._executeSQL();
        },
        function(error) {
          console.error("DATABASE ERROR: " + error);
        });
      });
    }
  };

  window.onbeforeunload = function() {
    dbManager.close();
  };

  return dbManager;
});
