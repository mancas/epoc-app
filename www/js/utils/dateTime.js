define([], function() {
  "use strict";

  const dayAbbreviations = ["D", "L", "M", "X", "J", "V", "S"];
  const dayList = ["Do", "Lun", "Ma", "Mie", "Ju", "Vi", "Sa"];
  const monthList = ["En", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep",
    "Oct", "Nov", "Dic"];
  const monthLongList = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  var DateTimeHelper = {
    get dayAbbreviations() {
      var days = [];
      for (var i = 1; i < dayAbbreviations.length; i++) {
        days.push(dayAbbreviations[i]);
      }

      days.push(dayAbbreviations[0]);
      return days;
    },

    get dayList() {
      var days = [];
      for (var i = 1; i < dayList.length - 1; i++) {
        days.push(dayList[i]);
      }

      days.push(dayList[0]);
      return days;
    },

    get monthList() {
      return monthList;
    },

    get monthLongList() {
      return monthLongList
    },

    addDays: function(d, days) {
      const newDate = this.clone(d);
      newDate.setDate(d.getDate() + days);
      return newDate;
    },

    addMonths: function(d, months) {
      const newDate = this.clone(d);
      newDate.setMonth(d.getMonth() + months);
      return newDate;
    },

    addYears: function(d, years) {
      const newDate = this.clone(d);
      newDate.setFullYear(d.getFullYear() + years);
      return newDate;
    },

    addHours: function(d, hours) {
      const newDate = this.clone(d);
      newDate.setHours(d.getHours() + hours);
      return newDate;
    },

    addMinutes: function(d, minutes) {
      const newDate = this.clone(d);
      newDate.setMinutes(d.getMinutes() + minutes);
      return newDate;
    },

    addSeconds: function(d, seconds) {
      const newDate = this.clone(d);
      newDate.setSeconds(d.getMinutes() + seconds);
      return newDate;
    },

    getDaysInMonth: function(d) {
      const resultDate = this.getFirstDayOfMonth(d);

      resultDate.setMonth(resultDate.getMonth() + 1);
      resultDate.setDate(resultDate.getDate() - 1);

      return resultDate.getDate();
    },

    getFirstDayOfMonth: function(d) {
      return new Date(d.getFullYear(), d.getMonth(), 1);
    },

    getFirstDayOfWeek: function() {
      const now = new Date();
      return new Date(now.setDate(now.getDate() - now.getDay()));
    },

    getWeekArray: function(d, firstDayOfWeek) {
      // By default the first day of week is Monday
      var firstDayOfWeek = firstDayOfWeek || 1;
      const dayArray = [];
      const daysInMonth = this.getDaysInMonth(d);
      const weekArray = [];
      var week = [];

      for (var i = 1; i <= daysInMonth; i++) {
        dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
      }

      var addWeek = function (week) {
        const emptyDays = 7 - week.length;
        for (var i = 0; i < emptyDays; ++i) {
          week[weekArray.length ? "push" : "unshift"](null);
        }
        weekArray.push(week);
      };

      dayArray.forEach(function(day) {
        if (week.length > 0 && day.getDay() === firstDayOfWeek) {
          addWeek(week);
          week = [];
        }
        week.push(day);
        if (dayArray.indexOf(day) === dayArray.length - 1) {
          addWeek(week);
        }
      });

      return weekArray;
    },

    format: function (d, options) {
      if (options && options.long) {
        return d.getDate() + " de " + monthLongList[d.getMonth()] + " de " + d.getFullYear().toString();
      } else if (options && options.fullDate) {
        var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
        var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear().toString().substring(2) +
          " - " + hour + ":" + minutes + ":" + seconds;
      }
      return dayList[d.getDay()] + ', ' + monthList[d.getMonth()] + " " + d.getFullYear().toString().substring(2);
    },

    formatMonth: function(d) {
      return monthLongList[d.getMonth()] + " " + d.getFullYear().toString();
    },

    equals: function(d1, d2) {
      return d1 && d2 &&
        (d1.getFullYear() === d2.getFullYear()) &&
        (d1.getMonth() === d2.getMonth()) &&
        (d1.getDate() === d2.getDate());
    },

    clone: function(d) {
      return new Date(d.getTime());
    }
  };

  return DateTimeHelper;
});
