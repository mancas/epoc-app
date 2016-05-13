define(["db"], function(DataBaseSchema) {
  "use strict";

  const DBNAME = "epoc.db";
  const SQL_WORDS = {
    CREATE_TABLE: "CREATE TABLE IF NOT EXISTS ",
    PRIMARY_KEY: "primary key",
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
      if (!window.sqlitePlugin) {
        return;
      }

      if (this.db) {
        successCb && successCb();
        return;
      }

      window.sqlitePlugin.openDatabase({
        name: DBNAME,
        location: 0
      }, function(db) {
        this.db = db;
        this.createTablesIfNeeded();
        successCb && successCb();
      }.bind(this), errorCb);
    },

    close: function() {
      if (this.db) {
        this.db.close();
      }
    },

    createTablesIfNeeded: function() {
      var tables = DataBaseSchema.tables;
      tables.forEach(function(table) {
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
      }.bind(this));
    },

    insert: function(tableName, values, successCb, errorCB) {
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
          statementParams += ",";
        }
      });
      statement += ") " + SQL_WORDS.VALUES + statementParams + ")";

      this._queueSQL(statement, statementValues, successCb, errorCB);
    },

    update: function(tableName, values, where, successCb, errorCB) {
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

      this._queueSQL(statement, statementValues, successCb, errorCB);
    },

    select: function(tableName, fields, where, successCb, errorCB) {
      fields = fields || "*";

      var statement = SQL_WORDS.SELECT + fields.toString() + " " + SQL_WORDS.FROM + tableName;

      if (where) {
        statement += " " + SQL_WORDS.WHERE + where;
      }

      this._queueSQL(statement, null, successCb, errorCB);
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

          return this;
        },

        or: function(values) {
          var objKeys = Object.keys(values);
          objKeys.forEach(function(field, index) {
            this.where += field + "=" + values[field];
            if (index !== objKeys.length - 1) {
              this.where += " " + SQL_WORDS.OR;
            }
          }.bind(this));

          return this;
        }
      }
    },

    _queueSQL: function(statement, params, successCb, errorCb) {
      this.sqlQueue.push({
        statement: statement,
        params: params || [],
        successCb: successCb,
        errorCb: errorCb
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
        tx.executeSql(nextStatement.statement, nextStatement.params, function(tx, result) {
          self.working = false;
          nextStatement.successCb && nextStatement.successCb(result);
          self._executeSQL();
        },
        function(error) {
          console.error("DATABASE ERROR: ", error);
          nextStatement.errorCb && nextStatement.errorCb(error);
        });
      });
    }
  };

  window.onbeforeunload = function() {
    dbManager.close();
  };

  return dbManager;
});
