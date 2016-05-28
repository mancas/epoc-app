define([
  "utils/dispatcher",
  "build/slideshow",
  "build/materialViews",
  "nutritionTestData",
  "utils/actions",
  "utils/utilities"
], function(Dispatcher, slideshowViews, materialViews, nutritionTestData, Actions, utils) {
  "use strict";

  var NutritionTestController = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      router: React.PropTypes.object
    },

    getInitialState: function() {
      return {
        showResults: false,
        score: null
      };
    },

    _showResults: function(model) {
      var score = 0;
      for (var key in model) {
        score += parseInt(model[key]);
      }
      this.setState({
        score: score,
        showResults: true
      });
    },

    render: function() {
      if (this.state.showResults) {
        return (
          <div className="section-info nutrition-test">
            <NutritionTestScoreView
              dispatcher={this.props.dispatcher}
              router={this.props.router}
              score={this.state.score} />
          </div>
        );
      } else {
        return (
          <div className="section-info nutrition-test">
            <slideshowViews.SlideshowView
              model={nutritionTestData.model}
              onFinish={this._showResults}
              slides={nutritionTestData.slides} />
          </div>
        );
      }
    }
  });

  var NutritionTestScoreView = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      router: React.PropTypes.object.isRequired,
      score: React.PropTypes.number.isRequired
    },

    componentDidMount: function() {
      var today = new Date();
      var oldDate = localStorage.getItem("nutritionTest");
      localStorage.setItem("nutritionTest", today.getTime());
      if (!oldDate) {
        this.props.dispatcher.dispatch(new Actions.AddNotification({
          title: "Test de estado nutricional",
          text: "Hace tres meses que realizaste el test. Es recomendable que lo vuelvas a realizar para llevar un control de tu nutrición,",
          type: utils.NOTIFICATION_TYPES.NUTRITION_TEST,
          read: 1
        }));
      }
    },

    shouldComponentUpdate: function() {
      return false;
    },

    renderLowerBoundInfo: function() {
      return (
        <p>
          ¡Genial! No tienes ningún problema de nutrición. Vuelve a realizar este test dentro de tres meses.
        </p>
      );
    },

    renderMiddleBoundInfo: function() {
      return (
        <div>
          <p>
            El riesgo de tener un estado nutricional pobre es <b>moderado</b>.
          </p>
          <p>
            Debes mejorar tus hábitos de comida y modo de vida. Existen muchos recursos que pueden ayudarte como un
            Licenciado en Nutrición, un centro de salud...
          </p>
        </div>
      );
    },

    renderUpperBoundInfo: function() {
      return (
        <div>
          <p>
            El riesgo de tener un estado nutricional pobre es <b>alto</b>.
          </p>
          <p>
            Visita a tu nutricionista, y consultale el resultado obtenido en el test. Te dará consejos para mejorar tu estado nutricional.
          </p>
        </div>
      );
    },

    renderScore: function() {
      if (this.props.score < 3) {
        return this.renderLowerBoundInfo();
      } else if (this.props.score >= 7) {
        return this.renderUpperBoundInfo();
      } else {
        return this.renderMiddleBoundInfo();
      }
    },

    saveScore: function() {
      this.props.dispatcher.dispatch(new Actions.UpdateUserData({
        nutritionScore: this.props.score,
        persist: true
      }));

      if (this.props.router.current === "nutrition-test") {
        window.history.back();
      }
    },

    render: function() {
      return (
        <div className="epoc-test-content epoc-test-score">
          <h1>Tu puntuación</h1>
          <h2 className="score">{this.props.score}</h2>
          <h2>¿Qué significa esta puntuación?</h2>
          {
            this.renderScore()
          }
          <p>
            Las señales de riesgo no representan un diagnóstico de ninguna
            condición o enfermedad. Si tienes alguna pregunta o preocupación
            consulta a un nutricionista.
          </p>
          <p>
            Puedes ver la puntuación en tu perfil y realizar el test todas las veces que quieras desde
            la pantalla principal.
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.saveScore}
            label="Guardar puntuación" />
        </div>
      );
    }
  });

  return {
    NutritionTestController: NutritionTestController
  };
});
