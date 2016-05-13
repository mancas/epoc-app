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
          id: "slide.welcome_test_title"
        },
        text: {
          id: "slide.welcome_test_text"
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
        type: "choice",
        hideIcon: true,
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 1
            }
          ]
        },
        text: {
          id: "slide.test.question1"
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
              label: "Ninguna vez",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "Con poca frecuencia",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "De vez en cuando",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 1
            },
            {
              label: "La mayoría del tiempo",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            },
            {
              label: "Todo el tiempo",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            }
          ],
          modelName: "question1",
          required: true
        }
      },
      {
        type: "choice",
        hideIcon: true,
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 2
            }
          ]
        },
        text: {
          id: "slide.test.question2"
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
              label: "No, nunca",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "Sólo con resfriados o infecciones de pecho",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "Sí, algunos días al mes",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 1
            },
            {
              label: "Sí, la mayoría de días",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 1
            },
            {
              label: "Sí, todos los días",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            }
          ],
          modelName: "question2",
          required: true
        }
      },
      {
        type: "choice",
        hideIcon: true,
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 3
            }
          ]
        },
        text: {
          id: "slide.test.question3"
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
              label: "Totalmente en desacuerdo",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "En desacuerdo",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "No estoy seguro",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "De acuerdo",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 1
            },
            {
              label: "Totalmente de acuerdo",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            }
          ],
          modelName: "question3",
          required: true
        }
      },
      {
        type: "choice",
        hideIcon: true,
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 4
            }
          ]
        },
        text: {
          id: "slide.test.question4"
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
              label: "No",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "Sí",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            },
            {
              label: "No lo sé",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            }
          ],
          modelName: "question4",
          required: true
        }
      },
      {
        type: "choice",
        hideIcon: true,
        title: {
          id: "slide.test.question.title",
          params: [
            {
              questionNumber: 5
            }
          ]
        },
        text: {
          id: "slide.test.question5"
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
              label: "De 35 a 49 años",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 0
            },
            {
              label: "De 50 a 59 años",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 1
            },
            {
              label: "De 60 a 69 años",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            },
            {
              label: "Mayor de 70",
              extraCSSClass: "borderless",
              fullWidth: true,
              value: 2
            }
          ],
          modelName: "question5",
          required: true
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
      "question1": null,
      "question2": null,
      "question3": null,
      "question4": null,
      "question5": null
    }
  };
});
