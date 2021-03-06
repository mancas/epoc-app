define([], function() {
  "use strict";

  return {
    slides: [
      {
        type: "information",
        title: {
          id: "slide.welcome_message_title",
          params: [
            {
              appName: {
                id: "appName"
              }
            }
          ]
        },
        text: {
          id: "slide.welcome_message_text"
        },
        buttons: [
          {
            label: {
              id: "slide.start_button_label"
            },
            fullWidth: true
          }
        ]
      },
      {
        type: "input",
        title: {
          id: "slide.user_name_title"
        },
        buttons: [
          {
            label: {
              id: "slide.next_slide_label"
            },
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu nombre",
            maxLength: 30,
            required: true,
            hint: "El nombre es necesario."
          },
          modelName: "userName",
          validationRules: ["userName"]
        }
      },
      {
        type: "choice",
        title: {
          id: "slide.user_epoc_grade_title"
        },
        buttons: [
          {
            label: {
              id: "slide.next_slide_label"
            },
            className: "ep-right"
          }
        ],
        question: {
          choices: [
            {
              label: "A",
              extraCSSClass: "bordered"
            },
            {
              label: "B",
              extraCSSClass: "bordered"
            },
            {
              label: "C",
              extraCSSClass: "bordered"
            },
            {
              label: "D",
              extraCSSClass: "bordered"
            }
          ],
          modelName: "gradeEPOC",
          required: true
        }
      },
      {
        type: "date",
        title: {
          id: "slide.user_last_revision_title",
          modelRequired: "userName"
        },
        buttons: [
          {
            label: {
              id: "slide.next_slide_label"
            },
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Última revisión médica",
            type: "date",
            required: true
          },
          modelName: "lastRevision",
          validationRules: ["lastRevision"]
        }
      },
      {
        type: "decision",
        title: {
          id: "slide.user_is_smoker_title"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: 1
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: 0
          }
        ],
        question: {
          modelName: "isSmoker"
        }
      },
      {
        type: "input",
        title: {
          id: "slide.user_personal_data_title"
        },
        text: {
          id: "slide.user_personal_data_text"
        },
        buttons: [
          {
            label: {
              id: "slide.next_slide_label"
            },
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu peso",
            minValue: 40,
            maxValue: 250,
            type: "number",
            required: true
          },
          modelName: "weight"
        }
      },
      {
        type: "input",
        title: {
          id: "slide.user_personal_data_title"
        },
        text: {
          id: "slide.user_height_text"
        },
        buttons: [
          {
            label: {
              id: "slide.next_slide_label"
            },
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu estatura (en cm)",
            minValue: 90,
            maxValue: 220,
            type: "number",
            required: true
          },
          modelName: "height"
        }
      },
      {
        type: "date",
        title: {
          id: "slide.user_personal_data_title"
        },
        text: {
          id: "slide.user_birth_text"
        },
        buttons: [
          {
            label: {
              id: "slide.finish_button_label"
            },
            className: "ep-right"
          }
        ],
        question: {
          field: {
            label: "Tu fecha de nacimiento",
            type: "date",
            required: true
          },
          modelName: "birth"
        }
      },
      {
        type: "loader",
        hideIcon: true,
        title: {
          id: "slide.preparing_app_title"
        },
        buttons: []
      }
    ],
    model: {
      userName: "",
      gradeEPOC: "",
      lastRevision: "",
      isSmoker: "",
      weight: "",
      height: "",
      birth: ""
    }
  };
});

