define([], function() {
  "use strict";

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
    return {
      userName: model.userName,
      gradeEPOC: model.gradeEPOC,
      lastRevision: model.lastRevision.toString(),
      isSmoker: parseInt(model.isSmoker),
      weight: parseInt(model.weight),
      height: parseInt(model.height),
      birth: model.birth.toString()
    };
  }

  function calculateIMC(weight, height) {
    // cm to m
    var mHeight = height/100;
    var imc = (weight/(Math.pow(mHeight, 2))).toFixed(2);
    var range;
    if (imc < 18.5) {
      range = "Bajo peso";
    } else if (imc >= 18.5 && imc <= 24.99) {
      range = "Rango normal";
    } else if (imc >= 25 && imc <= 29.99) {
      range = "Sobrepeso";
    } else {
      range = "Obesidad";
    }

    return {
      imc: imc,
      range: range
    };
  }

  return {
    calculateIMC: calculateIMC,
    closest: getClosest,
    prepareModel: prepareModel
  };
});
