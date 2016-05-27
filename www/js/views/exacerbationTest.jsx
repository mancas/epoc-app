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
      this.setState({
        model: model,
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

    renderInfectionInfo: function() {
      return (
        <div>
          <h1>Puede que tengas una infección</h1>
          <p>
            Es probable que los síntomas que has descrito se correspondan con una infección. Si es así, requerira de un
            antibiótico para su tratamiento.
          </p>
          <p>
            No te preocupes porque las infecciones en las vías respiratorias en pacientes con EPOC, son muy frecuentes, sobre todo
            las bronquitis y las neumonías. Ambas provocan un aumento de la tos y un cambio en el color de las flemas. La bronquitis
            puede presentar fiebre no mayor a 39ºC, pero la neumonía en ocasiones si que supera esa temperatura.
          </p>
          <p>
            <b>Te recomendamos que acudas cuanto antes a un especialista para que te recete los antibióticos si fuese necesario, no lo
            dejes pasar ya que este tipo de infecciones puede complicarse severamente.</b>
          </p>
        </div>
      );
    },

    renderExacerbationInfo: function() {
      return (
        <div>
          <h1>Tienes una exacerbación de EPOC</h1>
          <p>
            Recuerda que la exacerbación es un empeoramiento de los síntomas que provoca la EPOC. Se suele manifestar por la aparición
            de nuevos síntomas o el aumento de los ya existentes (mayor sensación de ahogo, mayor tos, etc.)
          </p>
          <p>
            Es muy importante que acudas a tu especialista para que te diagnostique correctamente y cambie tu tratamiento si fuese
            necesario. <b>No tomes la evaluación de este test como un diagnostico médico</b>
          </p>
        </div>
      );
    },

    renderDefaultInfo: function() {
      return (
        <div>
          <h1>¡Genial!</h1>
          <p>
            De acuerdo con las respuestas que has proporcionado, parece que no estas sufriendo una exacerbación.
          </p>
          <p>
            Recuerda que la exacerbación no es más que un empeoramiento de los síntomas ya existentes u otros nuevos. Si no has sentido
            has sentido un aumento de los síntomas en los últimos días, ¡es una buena noticia!
          </p>
          <p>
            Si crees que estas empeorando o no te encuentras del todo bien, no dudes en acudir a tu médico especialista. Nadie como él
            sabrá diagnosticarte de forma correcta.
          </p>
        </div>
      );
    },

    render: function() {
      return (
        <div className="epoc-test-content epoc-test-score">
          {
            this._isInfection() ?
              this.renderInfectionInfo() :
              this._isExacerbation() ?
                this.renderExacerbationInfo() :
                this.renderDefaultInfo()
          }
        </div>
      );
    }
  });

  var InfoTestView = React.createClass({
    statics: {
      TEST_URL: "http://www.controldemiepoc.com/"
    },

    shouldComponentUpdate: function () {
      return false;
    },

    openURL: function() {
      window.open(this.constructor.CODP_FOUNDATION_URL, "_blank", "location=yes");
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>Test de ¿cómo me encuentro?</h1>
          <p>
            Este test consta de cuatro preguntas a través de las cuales se puede evaluar de forma aproximada si
            un paciente está sufriendo una exacerbación o una infección. El resultado del test en
            ningún momento pretende ser un diagnóstico final, por lo que siempre debes seguir las pautas de tu médico.
          </p>
          <p>
            Todo el contenido del test pertenece a <b>controldemiepoc.com</b>, una aplicación que ofrece
            soluciones para los pacientes de EPOC.
          </p>
          <p>
            Puedes visitar la página web de la app en el siguiente enlace.
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.openURL}
            label="Acceder a Control de mi EPOC" />
        </div>
      );
    }
  });

  return {
    ExacerbationTestController: ExacerbationTestController
  };
});
