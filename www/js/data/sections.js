define([], function() {
  "use strict";

  return [
    {
      name: "¿Qué es la EPOC?",
      icon: "lungs",
      path: "#what-is-epoc"
    },
    {
      name: "Ejercicio físico",
      icon: "heart",
      path: "#my-exercises"
    },
    {
      name: "Inhaladores",
      icon: "inhaler",
      path: "#inhalers"
    },
    {
      name: "Mi nutrición",
      icon: "nutrition",
      path: "#my-nutrition"
    },
    {
      name: "Mis alarmas",
      icon: "alarm",
      path: "#my-alarms"
    },
    {
      name: "¿Estoy empeorando?",
      icon: "exacerbation",
      path: "#exacerbations"
    },
    {
      name: "El tabaco",
      icon: "cigarrette",
      path: "#do-not-smoke",
      isEnabled: {
        "isSmoker": true
      }
    },
    {
      name: "Test de riesgo",
      icon: "test",
      path: "#epoc-test"
    },
    {
      name: "Test de nutrición",
      icon: "nutrition_test",
      path: "#nutrition-test",
      isEnabled: {
        "nutritionScore": true
      }
    }
  ];
});
