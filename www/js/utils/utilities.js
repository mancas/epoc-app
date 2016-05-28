define([], function() {
  "use strict";

  const NOTIFICATION_TYPES = {
    WELCOME: 0,
    BMI: 1,
    SMOKER: 2,
    REMINDER: 3,
    NUTRITION_TEST: 4
  };

  const ALARM_TYPES = {
    SYSTEM: 0,
    MEDICINE: 1
  };

  const BORG_VALUES = [
    {
      label: "Sin disnea (ahogo)",
      value: 0
    },
    {
      label: "Muy ligera, apenas se nota",
      value: 0
    },
    {
      label: "Muy ligera",
      value: 1
    },
    {
      label: "Ligera",
      value: 2
    },
    {
      label: "Moderada",
      value: 3
    },
    {
      label: "En ocasiones severa",
      value: 4
    },
    {
      label: "Severa",
      value: 5
    },
    {
      label: "Muy severa",
      value: 7
    },
    {
      label: "Muy severa, en ocasiones máxima",
      value: 9
    },
    {
      label: "Máxima",
      value: 10
    }
  ];

  function getClosest(el, tag) {
    // this is necessary since nodeName is always in upper case
    tag = tag.toUpperCase();
    do {
      if (el.nodeName === tag) {
        // tag name is found! let's return it. :)
        return el;
      }
    } while (el.previousElementSibling ? el = el.previousElementSibling : el = el.parentNode);
    // not found :(
    return null;
  }

  function prepareModel(model) {
    var preparedModel = {};
    for (var key in model) {
      var value = model[key];
      switch (key) {
        case "lastRevision":
        case "birth":
          value = model[key].toString();
          break;
        case "isSmoker":
        case "weight":
        case "height":
          value = parseInt(model[key]);
          break;
      }

      preparedModel[key] = value;
    }

    return preparedModel;
  }

  function calculateBMI(weight, height) {
    // cm to m
    var mHeight = height/100;
    var bmi = (weight/(Math.pow(mHeight, 2))).toFixed(2);
    var range, message;
    if (bmi < 18.5) {
      range = "Bajo peso";
      message = "Tienes bajo peso, deberías llevar una alimentación equilibrada y ganar algo de peso. Consultalo con tu médico.";
    } else if (bmi >= 18.5 && bmi <= 24.99) {
      range = "Rango normal";
      message = "Tu peso es ideal, continua con tu alimentación equilibrada y practicando deporte para reducir los síntomas de la EPOC.";
    } else if (bmi >= 25 && bmi <= 29.99) {
      range = "Sobrepeso";
      message = "Tienes sobrepeso, no dejes de vigilar tu alimentación y visita a tu médico.";
    } else {
      range = "Obesidad";
      message = "Tienes obesidad, deberías visitar a tu médico para que te aconseje una dieta sana para bajar peso. " +
        "Recuerda que un peso excesivo puede hacer que tus síntomas empeoren.";
    }

    return {
      value: bmi,
      message: message,
      range: range
    };
  }

  function getBorgInfoFromValue(value) {
    value = parseInt(value);
    var borgInfo = BORG_VALUES.filter(function(element) {
      return element.value === value;
    });

    if (borgInfo.length) {
      var info = borgInfo[0];
      if (info.label === "Muy ligera, apenas se nota") {
        info.value = 0.5;
      }

      return info;
    } else {
      return null;
    }
  }

  return {
    ALARM_TYPES: ALARM_TYPES,
    BORG_VALUES: BORG_VALUES,
    calculateBMI: calculateBMI,
    closest: getClosest,
    getBorgInfoFromValue: getBorgInfoFromValue,
    NOTIFICATION_TYPES: NOTIFICATION_TYPES,
    prepareModel: prepareModel
  };
});
