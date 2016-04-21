define(["build/materialViews", "utils/utilities"], function(materialViews, utils) {
  "use strict";

  var ChoicesView = React.createClass({
    propTypes: {
      choices: React.PropTypes.array.isRequired,
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string
    },

    select: function(event) {
      var currentChoice = this.getDOMNode().querySelector(".choices .selected");
      console.info(currentChoice);

      if (currentChoice) {
        currentChoice.classList.remove("selected");
        var currentCheckbox = currentChoice.previousElementSibling;
        currentCheckbox.checked = false;
      }

      var target = event.target;
      if (target.nodeName !== "BUTTON") {
        target = utils.closest(target, "BUTTON");
      }
      target.classList.add("selected");
      var checkbox = utils.closest(target, "input");
      checkbox.checked = true;
    },

    render: function() {
      var cssClasses = {
        "choices": true
      };

      if (this.props.extraCSSClass) {
        cssClasses[this.props.extraCSSClass] = true;
      }
      return (
        <div className={classNames(cssClasses)}>
          {
            this.props.choices.map(function(choice, index) {
              return (
                <ChoiceButton
                  choiceName={this.props.choiceName}
                  extraCSSClass={choice.extraCSSClass}
                  handleClick={this.select}
                  key={index}
                  label={choice.label} />
              );
            }, this)
          }
        </div>
      );
    }
  });

  var ChoiceButton = React.createClass({
    propTypes: {
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string,
      handleClick: React.PropTypes.func,
      label: React.PropTypes.string.isRequired
    },

    render: function() {
      return (
        <div className="choice-button">
          <input className="hidden" name={this.props.choiceName} value={this.props.label} type="radio" />
          <materialViews.RippleButton
            extraCSSClasses={this.props.extraCSSClass}
            handleClick={this.props.handleClick}
            label={this.props.label} />
        </div>
      );
    }
  });

  var LoaderView = React.createClass({
    propTypes: {
      extraCSSClass: React.PropTypes.string,
      height: React.PropTypes.number,
      width: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        height: 40,
        width: 40
      }
    },

    render: function() {
      return (
        <div className="pulses-loader">
          <div className="first"></div>
          <div className="second"></div>
        </div>
      );
    }
  });

  var WhatIsEpocView = React.createClass({
    propTypes: {

    },

    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>EPOC son las siglas de Enfermedad Pulmonar Obstructiva Crónica</h1>
          <p>
            Se trata de una enfermedad muy frecuente en nuestra población.
            En nuestro medio, <b>la EPOC está causada fundamentalmente por el humo del tabaco.</b>
            Es muy importante que los pacientes con esta patología dejen de fumar, para que la enfermedad no progrese.
          </p>
          <div className="img-caption-group">
            <img src="../img/bronchus.jpg" />
            <span className="caption">Comparación entre un bronquio normal y un bronquio con EPOC</span>
          </div>
          <h1>¿Por qué aparece la EPOC?</h1>
          <p>
            El humo del tabaco contiene más de 4.000 sustancias que pueden ser tóxicas para el organismo.
            Al llegar a los pulmones, estas sustancias hacen que las células en los bronquios y en el alvéolo respiratorio
            dejen de funcionar correctamente. Esto lleva a que, por un lado, los bronquios se cierren y disminuya
            la cantidad de aire que puede moverse por su interior, y por otro lado, la zona donde se produce
            la entrada de oxígeno en nuestro organismo (el alvéolo respiratorio) se destruye en determinadas regiones y
            aparece el enfisema pulmonar, es decir, zonas del pulmón que únicamente tienen aire en su interior y que no
            pueden introducir oxígeno dentro del organismo.
          </p>
          <h1>¿Qué síntomas produce la EPOC?</h1>
          <p>
            El principal síntoma y el más importante es la sensación de ahogo.
          </p>
          <p>
            Esta sensación puede limitar la actividad que los pacientes con EPOC hacen día a día.
            Por ejemplo, cada vez dan paseos más cortos, y limitan su actividad física poco a poco hasta que dejan de moverse.
            Es importante identificar este síntoma de forma temprana para evitar que ocurra la limitación al ejercicio.
            La aparición de un catarro que nunca mejora es otro de los síntomas más importantes de la enfermedad
            (es la llamada bronquitis crónica). Para que este síntoma mejore, será necesario dejar de fumar.
            Es muy importante vigilar el color de la expectoración, ya que sus cambios pueden implicar la existencia de una infección.
          </p>
        </div>
      );
    }
  });

  var ExacerbationsView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>El empeoramiento de los síntomas se conoce como exacerbación</h1>
          <p>
            Los pacientes con EPOC a veces presentan un empeoramiento de sus síntomas.
            Esto puede pasar por distintos motivos: una infección por un virus o una bacteria,
            el efecto de sustancias contaminantes ambientales, etc.
          </p>
          <p>
            Las exacerbaciones son situaciones muy importantes en la evolución de la enfermedad de los pacientes con EPOC,
            que deben vigilar sus síntomas para tratarlas de forma temprana.
          </p>
          <h2>¿Qué debo vigilar?</h2>
          <materialViews.DropdownView
            label="Flemas">
            <p>
              El cambio de color en las flemas, y especialmente si estas se vuelven de color verde. Es probable que sea
              necesario tomar antibióticos o corticoides, o ambos, para controlar la exacerbación.
            </p>
          </materialViews.DropdownView>
          <materialViews.DropdownView
            label="Ahogo">
            <p>
              El aumento de la sensación de ahogo debe vigilarse también estrictamente (si aparece o aumenta) y
              consultar con el médico para revisar el tratamiento si fuese necesario.
            </p>
          </materialViews.DropdownView>
          <materialViews.DropdownView
            label="Hinchazón">
            <p>
              También es importante vigilar la aparición de hinchazón (edemas) en las extremidades inferiores.
              Si notas hinchazón acude a tu médico para que haga un diagnóstico más acertado.
            </p>
          </materialViews.DropdownView>
        </div>
      );
    }
  });

  return {
    ChoiceButton: ChoiceButton,
    ChoicesView: ChoicesView,
    ExacerbationsView: ExacerbationsView,
    LoaderView: LoaderView,
    WhatIsEpocView: WhatIsEpocView
  };
});
