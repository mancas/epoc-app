define([
  "utils/dispatcher",
  "build/slideshow",
  "build/materialViews",
  "epocTestData"
], function(Dispatcher, slideshowViews, materialViews, epocTestData) {
  "use strict";

  var EpocTestController = React.createClass({
    propTypes: {
      navigate: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired
    },

    handleInfoClick: function() {
      this.props.navigate("#epoc-test/information");
    },

    render: function() {
      return (
        <div className="app epoc-test">
          <materialViews.AppBarView
            currentRoute={this.props.router.current}
            infoCallback={this.handleInfoClick}
            showInfoButton={!this.props.router.showInfo}
            title={this.props.router.appBarTitle}
            zIndex={2} />
          <EpocTestContent
            router={this.props.router} />
        </div>
      );
    }
  });

  var EpocTestContent = React.createClass({
    propTypes: {
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
      if (this.props.router.showInfo) {
        return (
          <InfoTestView />
        );
      }

      if (this.state.showResults) {
        return (
          <EpocTestScoreView
            score={this.state.score} />
        );
      } else {
        return (
          <slideshowViews.SlideshowView
            model={epocTestData.model}
            onFinish={this._showResults}
            showPagination={false}
            slides={epocTestData.slides} />
        );
      }
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
        <div className="epoc-test-content epoc-test-score">
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

  var InfoTestView = React.createClass({
    statics: {
      CODP_FOUNDATION_URL: "http://www.copdfoundation.org/"
    },

    shouldComponentUpdate: function () {
      return false;
    },

    openURL: function() {
      window.open(this.constructor.CODP_FOUNDATION_URL, "_blank", "location=yes");
    },

    render: function() {
      return (
        <div className="epoc-test-content">
          <h1>Test de riesgo</h1>
          <p>
            Este test consta de cinco preguntas a través de las cuales se puede comprobar si una persona
            es suceptible de padecer o tener la EPOC. El resultado del test en ningún momento puede servir como
            un diagnóstico médico válido, es simplemente una herramienta guía que puede ayudar a los profesionales del sector
            a realizar un diagnóstico temprano y reducir así un mayor desgaste de la función respiratoria en caso de que el paciente
            padezca la EPOC.
          </p>
          <p>
            Todo el contenido del test pertenece a la <b>COPD Foundation</b>, una organización sin ánimo de lucro que se encarga
            de ayudar a los pacientes de EPOC y ofrecerles información para un mayor conocimiento de la enfermedad.
          </p>
          <p>
            Puedes visitar la página web de la COPD Foundation en el siguiente enlace. Encontrarás información más técnica sobre la EPOC
            así como consejos y hábitos de vida. (Información en inglés)
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.openURL}
            label="Acceder a la COPD Foundation" />
        </div>
      );
    }
  });

  return {
    EpocTestContent: EpocTestContent,
    EpocTestController: EpocTestController
  };
});
