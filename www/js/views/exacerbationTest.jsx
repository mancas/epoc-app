define([
  "utils/dispatcher",
  "build/slideshow",
  "build/materialViews",
  "exacerbationTestData",
  "utils/actions",
  "utils/utilities"
], function(Dispatcher, slideshowViews, materialViews, exacerbationTestData, Actions, utils) {
  "use strict";

  var ExacerbationTestController = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      router: React.PropTypes.object
    },

    getInitialState: function() {
      return {
        model: null,
        showResults: false
      };
    },

    _showResults: function(model) {
      console.info(model);
      this.setState({
        model: model,
        showResults: true
      });
    },

    render: function() {
      if (this.state.showResults) {
        return (
          <div className="section-info exacerbation-test">
            <ExacerbationTestResultView
              dispatcher={this.props.dispatcher}
              router={this.props.router}
              model={this.state.model} />
          </div>
        );
      } else {
        return (
          <div className="section-info exacerbation-test">
            <slideshowViews.SlideshowView
              model={exacerbationTestData.model}
              onFinish={this._showResults}
              showPagination={false}
              slides={exacerbationTestData.slides} />
          </div>
        );
      }
    }
  });

  var ExacerbationTestResultView = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      router: React.PropTypes.object.isRequired,
      model: React.PropTypes.object.isRequired
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

    _isInfection: function() {
      var model = this.props.model;
      if ((model.q1 || model.q2) && (model.q3 || model.q4) &&
        (model.q5 || model.q6) && parseInt(model.q7) === 2 && model.q8) {
        return true;
      }

      return false;
    },

    _isExacerbation: function() {
      var model = this.props.model;

      if (!(model.q1 && model.q2)) {
        return false;
      }

      // More readable code
      if (model.q8) {
        if (model.q3 && model.q4 &&
          (!model.q5 || (((model.q5 && !model.q6) || (model.q5 && model.q6)) &&
          (parseInt(model.q7) === 0 || parseInt(model.q7) === 1)))) {
          return true;
        }
      } else {
        if (model.q3 && model.q4 && !model.q5 ||
          !model.q3 && !model.q4 && model.q5 && model.q6 ||
          model.q3 && !model.q4 && model.q5 && model.q6 ||
          model.q3 && model.q4 && model.q5 && !model.q6 ||
          model.q3 && model.q4 && model.q5 && model.q6) {
          return true;
        }
      }

      return false
    },

    render: function() {
      return (
        <div className="epoc-test-content epoc-test-score">
          {
            this._isInfection() ?
              <p>Infeccion</p> :
              this._isExacerbation() ?
                <p>Exacerbacion</p> :
                <p>No es nah</p>
          }
        </div>
      );
    }
  });

  return {
    ExacerbationTestController: ExacerbationTestController
  };
});
