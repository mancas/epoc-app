define([], function() {
  "use strict";

  return {
    slides: [
      {
        type: "information",
        slideCSSClasses: {
          "epoc-test-intro": true
        },
        title: {
          id: "slide.exacerbation_test_title"
        },
        text: {
          id: "slide.exacerbation_test_text"
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
        type: "decision",
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 1
            }
          ]
        },
        text: {
          id: "slide.exacerbation_test.question1"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q1"
        },
        goTo: {
          slide: 3,
          condition: {
            modelName: "q1",
            modelValue: false
          }
        }
      },
      {
        type: "decision",
        text: {
          id: "slide.exacerbation_test.question2"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q2"
        }
      },
      {
        type: "decision",
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 2
            }
          ]
        },
        text: {
          id: "slide.exacerbation_test.question3"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q3"
        },
        goTo: {
          slide: 5,
          condition: {
            modelName: "q3",
            modelValue: false
          }
        }
      },
      {
        type: "decision",
        text: {
          id: "slide.exacerbation_test.question4"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q4"
        }
      },
      {
        type: "decision",
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 3
            }
          ]
        },
        text: {
          id: "slide.exacerbation_test.question5"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q5"
        },
        goTo: {
          slide: 8,
          condition: {
            modelName: "q5",
            modelValue: false
          }
        }
      },
      {
        type: "decision",
        text: {
          id: "slide.exacerbation_test.question6"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q6"
        }
      },
      {
        type: "select",
        text: {
          id: "slide.exacerbation_test.question7"
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
          modelName: "q7",
          currentValue: 0,
          options: [
            {
              label: "Blanco o transparente",
              value: 0
            },
            {
              label: "Amarillo",
              value: 1
            },
            {
              label: "Marrón oscuro",
              value: 2
            }
          ]
        }
      },
      {
        type: "decision",
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 4
            }
          ]
        },
        text: {
          id: "slide.exacerbation_test.question8"
        },
        buttons: [
          {
            label: {
              id: "slide.decision_yes_label"
            },
            className: "bordered",
            modelValue: true
          },
          {
            label: {
              id: "slide.decision_no_label"
            },
            className: "bordered",
            modelValue: false
          }
        ],
        question: {
          modelName: "q8"
        }
      },
      {
        type: "loader",
        hideIcon: true,
        title: {
          id: "slide.preparing_test_result_title"
        },
        buttons: []
      }
    ],
    model: {
      "q1": false,
      "q2": false,
      "q3": false,
      "q4": false,
      "q5": false,
      "q6": false,
      "q7": 0,
      "q8": false
    }
  };
});
