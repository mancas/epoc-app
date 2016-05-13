define([
  "store",
  "utils/databaseManager",
  "utils/dateTime",
  "utils/actions",
  "utils/utilities"
], function(Store, dbManager, DateTimeHelper, actions, utils) {
  "use strict";

  const welcomeNotification = {
    type: utils.NOTIFICATION_TYPES.WELCOME,
    title: "Bienvenido!",
    text: "Usando estas tarjetas te iremos informando de aquellas cosas que sean importantes para ti."
  };

  var UserStore = Store.createStore({
    actions: [
      "createUser",
      "setupApp",
      "appReady",
      "updateUserData"
    ],

    getInitialStoreState: function() {
      return {
        id: "",
        userName: "",
        gradeEPOC: "",
        lastRevision: "",
        isSmoker: "",
        weight: "",
        height: "",
        birth: "",
        appReady: false
      };
    },

    initialize: function() {
      var self = this;
      /*dbManager.openDatabase(function(){
        dbManager.select("User", null, null, function(result) {
          console.info("SELECT result initilize", result.rows.item(0));
          result.rows.item(0) && self.setStoreState(result.rows.item(0));
        });
      }, function(err) {
        console.error(err);
      });*/
    },

    createUser: function (actionData) {
      var newState = this._updateUserState(actionData);
      var self = this;

      var model = utils.prepareModel(newState);
      dbManager.openDatabase(function(){
        dbManager.insert("User", model, function(result) {
          console.info("INSERT result", result.rows.item(0), result);
          self.setStoreState({
            id: result.insertId
          });
        });
      }, function(err) {
        console.error(err);
      });
    },

    updateUserData: function(actionData) {
      var newState = this._updateUserState(actionData);
      if (actionData.persist) {
        this._updateDB(newState);
      }
    },

    _updateUserState: function (actionData) {
      var newState = {};

      for (var key in actionData) {
        if (key !== "name" &&
          (this._storeState.hasOwnProperty(key) && this._storeState[key] !== actionData[key])) {
          newState[key] = actionData[key];
        }
      }

      this.setStoreState(newState);
      return newState;
    },

    _updateDB: function(newState) {
      var model = utils.prepareModel(newState);
      var self = this;
      dbManager.openDatabase(function(){
        var whereBuilder = dbManager.createWhereBuilder();
        whereBuilder.and({id: self._storeState.id});

        dbManager.update("User", model, whereBuilder.where, function(result) {
          console.info("UPDATE RESULT", result);
          dbManager.select("User", null, null, function(result) {
            console.info("SELECT result", result.rows.item(0));
          });
        });
      }, function(err) {
        console.error(err);
      });
    },

    setupApp: function(actionData) {
      var revisionEvery = actionData.gradeEPOC === "A" || actionData.gradeEPOC === "B" ? 12 : 6;
      var revisionAlarm = DateTimeHelper.addMonths(actionData.lastRevision, revisionEvery);
      var diffInMs = Math.abs(revisionAlarm - actionData.lastRevision);
      // To minutes
      var diffInMins = Math.floor((diffInMs/1000)/60);

      this.dispatcher.dispatch(new actions.ScheduleAlarm({
        title: "Próxima revisión médica",
        text: "Recuerda que debes acudir al médico para tu revisión",
        at: revisionAlarm,
        every: diffInMins
      }));

      // TODO add notifications: reminders
      var notifications = [
        welcomeNotification
      ];
      var calculatedBMI = utils.calculateBMI(parseInt(actionData.weight), parseInt(actionData.height));
      notifications.push({
        type: utils.NOTIFICATION_TYPES.BMI,
        title: "Información sobre tu IMC",
        text: calculatedBMI.message
      });

      notifications.push({
        type: utils.NOTIFICATION_TYPES.SMOKER,
        title: "La EPOC y el tabaquísmo",
        text: "Recuerda que el tabaco es uno de los principales factores que provocan " +
          "el empeoramiento de los síntomas de la EPOC. Consulta con tu especialista para intentar dejar de fumar, " +
          "tu cuerpo te lo agradecerá.",
        read: !parseInt(actionData.isSmoker)
      });

      notifications.forEach(function (notification) {
        this.dispatcher.dispatch(new actions.AddNotification(notification));
      }, this);

      //setTimeout(function () {
        this.dispatcher.dispatch(new actions.AppReady());
      //}.bind(this), 5000);
    },

    appReady: function() {
      this.setStoreState({
        appReady: true
      });
    }
  });

  return UserStore;
});
