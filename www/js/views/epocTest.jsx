define([
  "utils/dispatcher",
  "build/slideshow",
  "build/materialViews",
  "epocTestData"
], function(Dispatcher, slideshowViews, materialViews, epocTestData) {
  "use strict";

  var EpocTestController = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      router: React.PropTypes.object.isRequired
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
      return (
        <div className="app epoc-test">
          <materialViews.AppBarView
            currentRoute={this.props.router.current}
            title={this.props.router.appBarTitle}
            zIndex={2} />
          {
            this.state.showResults ?
              <EpocTestScoreView
                score={this.state.score} /> :
              <slideshowViews.SlideshowView
                model={epocTestData.model}
                onFinish={this._showResults}
                showPagination={false}
                slides={epocTestData.slides} />
          }
        </div>
      );
    }
  });

  var EpocTestScoreView = React.createClass({
    propTypes: {
      score: React.PropTypes.number.isRequired
    },

    shouldComponentUpdate: function() {
      return false;
    },

    renderLowerBoundInfo: function() {
      return (
        <p>
          Tu puntuación se encuentra <b>entre 0 y 4</b> lo que significa que tus problemas respiratorios
          no deberían tener relación con la EPOC. Sin embargo, este test no es más que una herramienta para
          discernir rápidamente si puede tratarse de un caso de EPOC o no, pero no ofrece un diagnóstico médico
          definitivo.
        </p>
      );
    },

    renderUpperBoundInfo: function() {
      return (
        <div>
          <p>
            Tu puntuación se encuentra <b>entre 5 y 10</b> lo que significa que tus problemas respiratorios
            podrían ser causados por la EPOC. Cuanto más alta es la puntuación, más probabilidades hay de que padezcas
            la EPOC.
          </p>
          <p>
            Sin embargo, este test no es más que una herramienta para
            discernir rápidamente si puede tratarse de un caso de EPOC o no, pero no ofrece un diagnóstico médico
            definitivo.
          </p>
        </div>
      );
    },

    goBack: function() {
      window.history.back();
    },

    render: function() {
      return (
        <div className="epoc-test-score">
          <h1>Tu puntuación</h1>
          <h2 className="score">{this.props.score}</h2>
          <h2>¿Qué significa esta puntuación?</h2>
          {
            this.props.score < 5 ?
              this.renderLowerBoundInfo() : this.renderUpperBoundInfo()
          }
          <p>
            Es recomendable que visites a tu médico y realiceis este test juntos para que tenga información suficiente
            para basar su diagnostico. Recuerda ser sincero y abierto a la hora de describir los sintomas de tus problemas
            respiratorios y como estos afectan a tu vida diaria.
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.goBack}
            label="Volver al inicio" />
        </div>
      );
    }
  });

  return {
    EpocTestController: EpocTestController
  };
});
