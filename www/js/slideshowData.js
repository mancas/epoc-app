define([], function() {
  "use strict";

  return {
    slides: [
      {
        type: "information",
        title: "Bienvenido a {{APPNAME}}",
        label2: {
          id: "WELCOME_MSG",
          param: {
            name: "APPNAME",
            value: "userName"
          }
        },
        text: "Para poder ayudarte en tu día a día y mejorar tu calidad vida, vamos a realizarte algunas preguntas. ¿Estás preparado?",
        buttons: [
          {
            label: "Empezar",
            fullWidth: true
          }
        ]
      },
      {
        type: "input",
        title: "¿Cómo te llamas?",
        buttons: [
          {
            label: "Continuar",
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu nombre",
            fieldName: "userName",
            maxLength: 30,
            required: true,
            hint: "El nombre es necesario."
          },
          validationRules: ["userName"]
        }
      },
      {
        type: "choice",
        title: "Elige el grado de EPOC que te hayan diagnosticado",
        buttons: [
          {
            label: "Continuar",
            className: "ep-right"
          }
        ],
        question: {
          choices: [
            {
              label: "A",
              extraCSSClass: "btn-dark"
            },
            {
              label: "B",
              extraCSSClass: "btn-dark"
            },
            {
              label: "C",
              extraCSSClass: "btn-dark"
            },
            {
              label: "D",
              extraCSSClass: "btn-dark"
            }
          ],
          fieldName: "gradeEPOC",
          required: true
        }
      },
      {
        type: "input",
        title: "{{USERNAME}}, ¿cuándo fuiste a tu última revisión médica?",
        buttons: [
          {
            label: "Continuar",
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Última revisión médica",
            fieldName: "lastRevision",
            type: "date",
            required: true
          },
          validationRules: ["lastRevision"]
        }
      },
      {
        type: "decision",
        title: "{{USERNAME}}, ¿eres fumador?",
        buttons: [
          {
            label: "Yes",
            className: "btn-dark"
          },
          {
            label: "No",
            className: "btn-dark"
          }
        ],
        question: {
          fieldName: "isSmoker"
        }
      },
      {
        type: "input",
        title: "Datos personales",
        text: "Necesitamos tu peso y estatura para llevar un control de tu evolución y poder recomendarte pautas para vivir mejor.",
        buttons: [
          {
            label: "Continuar",
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu peso",
            fieldName: "userWeight",
            required: true
          },
          validationRules: ["userWeight"]
        }
      },
      {
        type: "input",
        title: "Datos personales",
        text: "¿Cuánto mides?",
        buttons: [
          {
            label: "Continuar",
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu estatura (en cm)",
            fieldName: "userHeight",
            required: true
          },
          validationRules: ["userHeight"]
        }
      },
      {
        type: "input",
        title: "Datos personales",
        text: "¡Ya estamos acabando! Sólo nos falta tu fecha de nacimiento.",
        buttons: [
          {
            label: "Terminar"
          }
        ],
        question: {
          field: {
            label: "Tu fecha de nacimiento",
            fieldName: "userBirth",
            type: "date",
            required: true
          },
          validationRules: ["userBirth"]
        }
      }
    ],
    model: {
      userName: "",
      gradeEPOC: "",
      lastRevision: "",
      isSmoker: "",
      userWeight: "",
      userHeight: "",
      userBirth: ""
    }
  };
});

