define([
  "build/materialViews",
  "utils/dispatcher",
  "utils/actions",
  "utils/utilities",
  "utils/dateTime",
  "mixins/storeMixin",
  "_"], function(materialViews, Dispatcher, Actions, utils, DateTimeHelper, StoreMixin, _) {
  "use strict";

  var ChoicesView = React.createClass({
    propTypes: {
      choices: React.PropTypes.array.isRequired,
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string
    },

    select: function(event) {
      var currentChoice = this.getDOMNode().querySelector(".choices .selected");

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

  var UserProfileView = React.createClass({
    mixins: [
      StoreMixin("userStore")
    ],

    statics: {
      REFS: [
        "weight",
        "height",
        "isSmoker"
      ]
    },

    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
    },

    getInitialState: function () {
      return _.extend(this.getStore().getStoreState(), {
        editMode: false
      });
    },

    toggleEditMode: function () {
      this.setState({
        editMode: !this.state.editMode
      });

      if (this.state.editMode) {
        var newState = {};
        // Time to update profile
        this.constructor.REFS.forEach(function(ref) {
          var editableField = this.refs[ref];
          var newValue = editableField.getNewValue();
          if (this.state[ref].toString() !== newValue.toString()) {
            newState[ref] = parseInt(newValue);
          }
        }, this);

        if (_.isEmpty(newState)) {
          return;
        }
        // Save data into database
        newState.persist = true;
        this.props.dispatcher.dispatch(new Actions.UpdateUserData(newState));
      }
    },

    render: function () {
      var fabIcon = this.state.editMode ? "check.svg" : "pencil.svg";
      var isSmokerIcon = "smoke.svg";
      var notSmokerIcon = "smoke_free.svg";
      var calculatedIMC = utils.calculateIMC(this.state.weight, this.state.height);

      return (
        <div className="user-profile">
          <div className="user-name">
            <span className="user-first-letter">
              {
                this.state.userName ? this.state.userName.charAt(0) : ""
              }
            </span>
          </div>
          <div className="user-information">
            <materialViews.FloatActionButton
              extraCSSClasses="edit-mode"
              handleClick={this.toggleEditMode}>
              <img src={"../../img/material/" + fabIcon} />
            </materialViews.FloatActionButton>
            <div className="profile-section">
              <div className="icon-group">
                <img className="icon" src="../../img/material/person.svg" />
                <p className="text-row">Nombre</p>
              </div>
              <p className="text-row">{this.state.userName}</p>
              <div className="icon-group no-icon">
                <p className="text-row">Peso y estatura</p>
              </div>
              <EditableField
                isEditModeActive={this.state.editMode}
                label={this.state.weight.toString()}
                type="input"
                inputType="number"
                units="kilos"
                ref="weight" />
              <EditableField
                isEditModeActive={this.state.editMode}
                label={this.state.height.toString()}
                type="input"
                inputType="number"
                units="centímetros"
                ref="height" />
              <div className="icon-group">
                <img className="icon" src="../../img/material/cake.svg" />
                <p className="text-row">Cumpleaños</p>
              </div>
              <p className="text-row">{DateTimeHelper.format(new Date(this.state.birth), {long: true})}</p>
              <div className="icon-group">
                <img className="icon" src={"../../img/material/" + (this.state.isSmoker ? isSmokerIcon : notSmokerIcon)} />
                <EditableField
                  currentValue={this.state.isSmoker ? 1 : 0}
                  isEditModeActive={this.state.editMode}
                  label={this.state.isSmoker ? "Fumador" : "No fumador"}
                  type="select"
                  values={[{label: "Fumador", value: 1}, {label: "No fumador", value: 0}]}
                  ref="isSmoker" />
              </div>
              <div className="icon-group no-icon">
                <p className="text-row">IMC</p>
              </div>
              <p className="text-row">{calculatedIMC.imc + " - " + calculatedIMC.range}</p>
              <div className="icon-group no-icon">
                <p className="text-row">Grado de EPOC diagnosticado</p>
              </div>
              <p className="text-row">{this.state.gradeEPOC}</p>
            </div>
          </div>
        </div>
      );
    }
  });

  var EditableField = React.createClass({
    propTypes: {
      currentValue: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      isEditModeActive: React.PropTypes.bool.isRequired,
      label: React.PropTypes.string.isRequired,
      type: React.PropTypes.oneOf(["input", "select"]).isRequired,
      inputType: React.PropTypes.string,
      units: React.PropTypes.string,
      values: React.PropTypes.array
    },

    getInitialState: function() {
      return {
        newValue: (this.props.type === "input" ? this.props.label : this.props.currentValue)
      }
    },

    getNewValue: function() {
      return this.state.newValue;
    },

    handleFieldChange: function(value) {
      this.setState({
        newValue: value
      });
    },

    getLabel: function() {
      if (this.props.type === "input") {
        return this.state.newValue + " " + this.props.units;
      } else {
        var selectedOption = this.props.values.filter(function(option) {
          console.info(option, this.state.newValue);
          return option.value.toString() === this.state.newValue.toString();
        }, this);

        return selectedOption[0].label;
      }
    },

    render: function() {
      var cssClasses = {
        "editable-field": true,
        "editable": this.props.isEditModeActive
      };
      return (
        <div className={classNames(cssClasses)}>
          <p className="text-row">{this.getLabel()}</p>
          {
            this.props.type === "input" ?
              <materialViews.Input
                inputName={this.props.label}
                onChange={this.handleFieldChange}
                type={this.props.inputType}
                value={this.props.label}/> :
              <materialViews.SelectView
                currentValue={this.props.currentValue.toString()}
                onChange={this.handleFieldChange}
                selectName={this.props.label}
                values={this.props.values} />
          }
        </div>
      );
    }
  });

  return {
    ChoiceButton: ChoiceButton,
    ChoicesView: ChoicesView,
    ExacerbationsView: ExacerbationsView,
    LoaderView: LoaderView,
    UserProfileView: UserProfileView,
    WhatIsEpocView: WhatIsEpocView
  };
});
