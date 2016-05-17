define([
  "build/materialViews",
  "utils/dispatcher",
  "utils/actions",
  "utils/utilities",
  "utils/dateTime",
  "mixins/storeMixin",
  "Chart",
  "_"], function(materialViews, Dispatcher, Actions, utils, DateTimeHelper, StoreMixin, Chart, _) {
  "use strict";

  var ChoicesView = React.createClass({
    propTypes: {
      choices: React.PropTypes.array.isRequired,
      choiceName: React.PropTypes.string.isRequired,
      extraCSSClass: React.PropTypes.string,
      hasValue: React.PropTypes.func
    },

    componentDidMount: function() {
      this.props.hasValue && this.props.hasValue(false);
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

      this.props.hasValue && this.props.hasValue(true);
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
                  fullWidth={choice.fullWidth}
                  handleClick={this.select}
                  key={index}
                  label={choice.label}
                  value={choice.value} />
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
      fullWidth: React.PropTypes.bool,
      handleClick: React.PropTypes.func,
      label: React.PropTypes.string.isRequired,
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ])
    },

    render: function() {
      var inputValue = typeof this.props.value !== "undefined" ? this.props.value : this.props.label;
      return (
        <div className="choice-button">
          <input className="hidden" name={this.props.choiceName} value={inputValue} type="radio" />
          <materialViews.RippleButton
            extraCSSClasses={this.props.extraCSSClass}
            fullWidth={this.props.fullWidth}
            handleClick={this.props.handleClick}
            label={this.props.label} />
        </div>
      );
    }
  });

  var LoaderView = React.createClass({
    propTypes: {
      height: React.PropTypes.number,
      width: React.PropTypes.number
    },

    shouldComponentUpdate: function() {
      return false;
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
            Es muy importante que los pacientes con esta patología dejen de fumar y eviten lugares con humos, para
            que la enfermedad no progrese.
          </p>
          <div className="img-caption-group">
            <img src="img/bronchus.jpg" />
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
            Es muy importante vigilar el color y consistencia de la expectoración (flemas), ya que sus cambios
            pueden implicar la existencia de una infección.
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
            el efecto de sustancias contaminantes ambientales, por cambio de hábitos, por exposición a alérgenos, etc.
          </p>
          <p>
            Las exacerbaciones son situaciones muy importantes en la evolución de la enfermedad de los pacientes con EPOC,
            que deben vigilar sus síntomas para tratarlas de forma temprana.
          </p>
          <h2>¿Qué debo vigilar?</h2>
          <materialViews.DropdownView
            label="Flemas">
            <p>
              El cambio de color en las flemas, y especialmente si estas se vuelven de color verde. Es probable que se trate
              de una infección, consulta con tu especialista para recibir tramiento si fuese necesario.
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

    componentDidUpdate: function(prevProps, prevState) {
      if (this.state.bmi.range !== prevState.bmi.range) {
        // Just enable notification if bmi range has changed
        this.props.dispatcher.dispatch(new Actions.UpdateNotification({
          type: utils.NOTIFICATION_TYPES.BMI,
          content: this.state.bmi.message,
          read: 0
        }));
      }

      if (!prevState.isSmoker && this.state.isSmoker) {
        this.props.dispatcher.dispatch(new Actions.UpdateNotification({
          type: utils.NOTIFICATION_TYPES.SMOKER,
          read: 0
        }));
      }
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
      if (!this.state.weight || !this.state.height) {
        return null;
      }

      var fabIcon = this.state.editMode ? "check.svg" : "pencil.svg";
      var isSmokerIcon = "smoke.svg";
      var notSmokerIcon = "smoke_free.svg";

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
              <img src={"img/material/" + fabIcon} />
            </materialViews.FloatActionButton>
            <div className="profile-section">
              <div className="icon-group">
                <img className="icon" src="img/material/person.svg" />
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
                <img className="icon" src="img/material/cake.svg" />
                <p className="text-row">Cumpleaños</p>
              </div>
              <p className="text-row">{DateTimeHelper.format(new Date(this.state.birth), {long: true})}</p>
              <div className="icon-group">
                <img className="icon" src={"img/material/" + (this.state.isSmoker ? isSmokerIcon : notSmokerIcon)} />
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
              <p className="text-row">{this.state.bmi.value + " - " + this.state.bmi.range}</p>
              <div className="icon-group no-icon">
                <p className="text-row">Grado de EPOC diagnosticado</p>
              </div>
              <p className="text-row">{"GOLD " + this.state.gradeEPOC}</p>
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

  var MyAlarmsView = React.createClass({
    mixins: [
      StoreMixin("alarmStore")
    ],

    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
    },

    getInitialState: function() {
      return _.extend(this.getStore().getStoreState(), {
        addModeEnabled: false,
        isValid: false
      });
    },

    toggleAddMode: function() {
      this.setState({
        addModeEnabled: !this.state.addModeEnabled
      });
    },

    isValid: function(valid) {
      this.setState({
        isValid: valid
      });
    },

    onClose: function(alarmData) {
      if (!this.state.isValid) {
        return;
      }

      console.info(alarmData);
      var alarmDate = new Date();
      alarmDate.setHours(alarmData.time.hours);
      alarmDate.setMinutes(alarmData.time.minutes);
      alarmDate.setSeconds(0);
      this.props.dispatcher.dispatch(new Actions.ScheduleAlarm({
        title: alarmData.title,
        text: "",
        at: alarmDate,
        // Hours to minutes
        every: parseInt(alarmData.periodicity) * 60,
        type: utils.ALARM_TYPES.MEDICINE
      }));
    },

    render: function() {
      var icon = "add.svg";
      var iconCSSClasses = {
        "add-button": true
      };

      if (this.state.addModeEnabled) {
        icon = "check.svg";
        if (!this.state.isValid) {
          icon = "clear.svg";
        }
      }

      return (
        <div className="section-info alarm-list">
          <h1>Alarmas</h1>
          <p>
            La aplicación te recordará, de forma automática, cuando debes acudir a una revisión médica dependiendo
            de tu grado de EPOC, pero también puede avisarte para no olvidar tomar la dosis de medicamento que tu médico te haya
            recetado.
          </p>
          <p>
            Añadir nuevas alarmas es fácil, solo tienes que pulsar en el botón <b>"+"</b> y ajustar el tiempo entre cada dosis y la hora
            de la toma.
          </p>
          {
            this.state.alarms.map(function(alarm, index) {
              return (
                <AlarmView
                  alarm={alarm}
                  dispatcher={this.props.dispatcher}
                  key={index} />
              );
            }, this)
          }
          <materialViews.FloatActionButton
            extraCSSClasses={iconCSSClasses}
            handleClick={this.toggleAddMode}>
            <img src={"img/material/" + icon} />
          </materialViews.FloatActionButton>
          <AddAlarmView
            isValid={this.isValid}
            onClose={this.onClose}
            show={this.state.addModeEnabled} />
        </div>
      );
    }
  });

  var AlarmView = React.createClass({
    propTypes: {
      alarm: React.PropTypes.object.isRequired,
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
    },

    cancelAlarm: function() {
      this.props.dispatcher.dispatch(new Actions.CancelAlarm({
        id: this.props.alarm.id
      }));
    },

    render: function() {
      var date = new Date(this.props.alarm.at * 1000);
      var time = DateTimeHelper.formatTime(date);
      var periodicity = this.props.alarm.every/60;
      return (
        <div className="alarm">
          <div className="alarm-info">
            <h2>{this.props.alarm.title}</h2>
            <span>
              {time + " - Repetir cada " + periodicity + " horas"}
            </span>
          </div>
          <materialViews.RippleButton
            extraCSSClasses={{"borderless": true, "cancel-alarm-btn": true}}
            handleClick={this.cancelAlarm}>
            <img src="img/material/clear_dark.svg" />
          </materialViews.RippleButton>
        </div>
      );
    }
  });

  var AddAlarmView = React.createClass({
    statics: {
      PERIODICITY_VALUES: [
        {
          label: "2 horas",
          value: 2
        },
        {
          label: "4 horas",
          value: 4
        },
        {
          label: "6 horas",
          value: 6
        },
        {
          label: "8 horas",
          value: 8
        },
        {
          label: "12 horas",
          value: 12
        },
        {
          label: "24 horas",
          value: 24
        }
      ]
    },

    propTypes: {
      isValid: React.PropTypes.func.isRequired,
      onClose: React.PropTypes.func,
      show: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
      return {
        data: {
          periodicity: 2
        },
        showTimePicker: false,
        valid: {
          title: false,
          time: false
        }
      };
    },

    componentWillReceiveProps: function(newProps) {
      if (this.props.show && !newProps.show) {
        this.props.onClose && this.props.onClose(this.state.data);
      }
    },

    handleFieldChange: function(value) {
      this.setState({
        data: value
      });
    },

    handleOnFocus: function() {
      this.setState({
        showTimePicker: true
      });
    },

    handleTimePickerAccept: function(hours, minutes) {
      var validState = this.state.valid;
      validState.time = true;
      var dataState = this.state.data;
      dataState.time = {
        hours: hours,
        minutes: minutes
      };
      this.setState({
        showTimePicker: false,
        valid: validState,
        data: dataState
      });

      var d = new Date();
      d.setHours(hours, minutes, 0, 0);

      this.refs.alarmTime.setInputValue(DateTimeHelper.formatTime(d));
      this.isValid();
    },

    handleTimePickerCancel: function() {
      this.setState({
        showTimePicker: false
      });
    },

    handleTitleChange: function(value) {
      var validState = this.state.valid;
      validState.title = !!value;
      var dataState = this.state.data;
      dataState.title = value;
      this.setState({
        data: dataState,
        valid: validState
      });

      this.isValid();
    },

    handlePeriodicityChange: function(value) {
      var dataState = this.state.data;
      dataState.periodicity = value;
      this.setState({
        data: dataState
      });
    },

    isValid: function() {
      var validState = this.state.valid;
      var isValid = validState.title && validState.time;

      this.props.isValid(isValid);
    },

    render: function() {
      return (
        <SlideScreenView
          show={this.props.show}>
          <h1>Añadir nueva alarma</h1>
          <p>
            Crea una nueva alarma para recordar la toma de tu medicación a la hora y periodicidad que tu indiques.
          </p>
          <h2>Pon un título a tu alarma</h2>
          <materialViews.Input
            hasValue={this.props.hasValue}
            inputName={"alarm-title"}
            label={"Título de la alarma"}
            onChange={this.handleTitleChange}
            type={"text"} />
          <h2>¿Cada cuanto tienes que tomar la medicación?</h2>
          <materialViews.SelectView
            currentValue={"2"}
            onChange={this.handlePeriodicityChange}
            selectName={"alarm-periodicity"}
            values={this.constructor.PERIODICITY_VALUES} />
          <h2>¿A qué hora?</h2>
          <materialViews.Input
            hasValue={this.props.hasValue}
            inputName={"alarm-time"}
            label={"Hora de la alarma"}
            onFocus={this.handleOnFocus}
            ref="alarmTime"
            type={"time"} />
          <materialViews.TimePickerView
            format={24}
            handleAccept={this.handleTimePickerAccept}
            handleCancel={this.handleTimePickerCancel}
            show={this.state.showTimePicker} />
        </SlideScreenView>
      );
    }
  });

  var InhalersView = React.createClass({
    propTypes: {
      navigate: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired
    },

    render: function() {
      switch (parseInt(this.props.router.inhalerType)) {
        case 1:
          return (
            <InhalerMDIView />
          );
        case 2:
          return (
            <InhalerMDIAndSpacerView />
          );
        case 3:
          return (
            <InhalerDryPowderView />
          );
        default:
          return (
            <InhalersInformationView
              navigate={this.props.navigate} />
          );
      }
    }
  });

  var InhalersInformationView = React.createClass({
    propTypes: {
      navigate: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate: function() {
      return false;
    },

    navigateTo: function (inhalerType) {
      this.props.navigate("#inhalers/" + inhalerType);
    },

    renderNavigationButton: function (inhalerType) {
      var self = this;
      var navigateWrapperFunc = function() {
        self.navigateTo(inhalerType);
      };
      return (
        <materialViews.RippleButton
          extraCSSClasses={{"borderless": true, "ep-right": true}}
          handleClick={navigateWrapperFunc}
          label="Ver más" />
      );
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>Tipos de inhaladores</h1>
          <p>
            Existen diferentes tipos de inhaladores para controlar los síntomas. Cada uno de ellos funciona de una forma
            diferente y su eficiencia dependerá del correcto uso del mismo. Para saber como realizar correctamente la inhalación,
            selecciona tu inhalador y sigue los pasos descritos, poco a poco te habituarás a su uso.
          </p>
          <p>
            <b>Esta información debe ser entendida como una guía anteponiendose siempre las recomendaciones de los especialistas.</b>
          </p>
          <materialViews.DropdownView
            extraCSSClass="inhaler-section"
            label="Cartuchos presurizados">
            <img src="img/cartucho_presurizado.jpg" />
            <p>
              El medicamento se mezcla con un compuesto que es expulsado en forma de aerosol.
            </p>
            {this.renderNavigationButton(1)}
          </materialViews.DropdownView>
          <materialViews.DropdownView
            extraCSSClass="inhaler-section"
            label="Con cámara espaciadora">
            <img src="img/camara_espaciadora.jpg" />
            <p>
              La cámara espaciadora es un aparato diseñado para mejorar la eficacia en el uso de los inhaladores presurizados de dosis controlada.
            </p>
            {this.renderNavigationButton(2)}
          </materialViews.DropdownView>
          <materialViews.DropdownView
            extraCSSClass="inhaler-section"
            label="Dispositivos de polvo seco">
            <img src="img/polvo_seco.gif" />
            <p>
              El fármaco se encuentra alojado en un depósito o en cápsulas, normalmente asociado a lactosa, formando un conglomerado.
              Son medicamentos que, como su propio nombre indica, se inhalan en forma de polvo.
            </p>
            {this.renderNavigationButton(3)}
          </materialViews.DropdownView>
        </div>
      );
    }
  });

  var InhalerMDIView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function () {
      return (
        <div className="section-info">
          <h1>Inhalador de cartucho presurizado</h1>
          <p>
            Este tipo de inhalador fue el primero en aparecer y fue utilizado durante décadas. Consta de un pequeño cartucho
            presurizado dónde están mezclados el medicamento y un aditivo necesario para que se forme el aerosol.
          </p>
          <p>
            Aunque su uso está muy estandarizado, en la mayoría de ocasiones se utiliza de forma errónea. Entre los fallos más comunes
            se encuentran el olvidar agitarlo antes de su uso, no realizar una espiración prolongada previa a la utilización del medicamento
            para vaciar los pulmones u olvidar mantener la respiración unos segundos después de haber inhalado el medicamento.
          </p>
          <h2>Cómo utilizar este inhalador</h2>
          <div className="inhaler-steps">
            <div className="inhaler-step">
              <span className="step">1</span>
              <p>Agitar el inhalador.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">2</span>
              <p>Retirar el capuchón protector de la boquilla.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">3</span>
              <p>Vaciar los pulmones realizando una espiración forzada.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">4</span>
              <p>Colocar el inhalador en la boca y apretar los labios alrededor de la boquilla (sin usar los dientes).</p>
            </div>
            <div className="inhaler-step">
              <span className="step">5</span>
              <p>Comenzar a inspirar lentamente.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">6</span>
              <p>Apretar el inhalador y continuar inspirando lenta y profundamente.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">7</span>
              <p>Aguantar la respiración durante 10 segundos.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">8</span>
              <p>Espirar lentamente</p>
            </div>
            <div className="inhaler-step">
              <span className="step">9</span>
              <p>Enjuagar la boca con abundante agua (este paso es muy importante para evitar sobrecrecimiento bacteriano).</p>
            </div>
            <div className="inhaler-step">
              <span className="step">10</span>
              <p>Volver a colocar el capuchón en el inhalador.</p>
            </div>
          </div>
        </div>
      );
    }
  });

  var InhalerMDIAndSpacerView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function () {
      return (
        <div className="section-info">
          <h1>Inhalador de cartucho presurizado con cámara espaciadora</h1>
          <p>
            Los inhaladores de cartucho presurizado a menudo vienen acompañados de una cámara espaciadora para hacer más fácil
            la inhalación de la medicación, sobre todo en los más jóvenes.
          </p>
          <p>
            La cámara espaciadora no es más que un contenedor de plástico donde se libera la medicación para aspirarla lentamente
            como si se estuviese respirando de forma normal. Este método es muy útil (para pacientes con dificultades de aprendizaje en el manejo del inhalador) personas y niños con asma a los que les cuesta
            más coordinar la inhalación del medicamente con la liberación del mismo.
          </p>
          <p>
            Es muy importante el cuidado y mantenimiento de la cámara espaciadora ya que la saliba adherida a las paredes puede evitar
            que la medicación fluya de un extremo a otro de la cámara. Para su lavado es recomendable utilizar
            <b>abundante agua y jabón neutro</b>, procurando no frotar el interior para que la electricidad estática no atrape el medicamento en las paredes.
            TODO Pulsación al aire para hacer de puente
          </p>
          <h2>Cómo utilizar este inhalador</h2>
          <div className="inhaler-steps">
            <div className="inhaler-step">
              <span className="step">1</span>
              <p>Agitar el inhalador.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">2</span>
              <p>Retirar el capuchón protector de la boquilla.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">3</span>
              <p>Acoplar el inhalador a la cámara espaciadora.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">4</span>
              <p>Vaciar los pulmones realizando una espiración forzada.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">5</span>
              <p>Acoplar la boquilla de la cámara en la boca y sellarla con los labios (sin utilizar los dientes).</p>
            </div>
            <div className="inhaler-step">
              <span className="step">6</span>
              <p>Realizar una primera pulsación para que la medicación se adhiera a las paredes de la cámara.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">7</span>
              <p>Realizamos la siguiente pulsación y respiramos con normalidad.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">8</span>
              <p>Aguantar la respiración durante 10 segundos.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">9</span>
              <p>Desmontar el inhalador de la cámara y colocarle el capuchón protector en la boquilla.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">10</span>
              <p>Enjuagar la boca con abundante agua (este paso es muy importante para evitar sobrecrecimiento bacteriano).</p>
            </div>
            <div className="inhaler-step">
              <span className="step">11</span>
              <p>Lavar la cámara espaciadora.</p>
            </div>
          </div>
        </div>
      );
    }
  });

  var InhalerDryPowderView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function () {
      return (
        <div className="section-info">
          <h1>Inhalador de polvo seco</h1>
          <p>
            Este tipo de inhalador contiene polvo seco y no precisan de ninguna pulsación para la liberación de la dosis.
            Lo único que require es la activación de un mecanismo manual para preparar la dosis y posteriormente inhalar profundamente.
          </p>
          <h2>Cómo utilizar este inhalador</h2>
          <div className="inhaler-steps">
            <div className="inhaler-step">
              <span className="step">1</span>
              <p>Activar el mecanismo manual para liberar la dosis.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">2</span>
              <p>Vaciar los pulmones realizando una espiración forzada.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">3</span>
              <p>Colocar el inhalador en la boca y sellarlo con los labios (sin utilizar los dientes).</p>
            </div>
            <div className="inhaler-step">
              <span className="step">4</span>
              <p>Inspirar de manera enérgica y profunda la medicación.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">5</span>
              <p>Aguantar la respiración durante 10 segundos.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">6</span>
              <p>Exhalar el aire de los pulmones.</p>
            </div>
            <div className="inhaler-step">
              <span className="step">7</span>
              <p>Enjuagarse la boca con abundante agua para eliminar posibles restos de medicación.</p>
            </div>
          </div>
        </div>
      );
    }
  });

  var EPOCAndSmokersView = React.createClass({
    statics: {
      INFO_URL: "http://www.msssi.gob.es/ciudadanos/proteccionSalud/tabaco/programaJovenes/home.htm"
    },

    shouldComponentUpdate: function() {
      return false;
    },

    openURL: function() {
      window.open(this.constructor.INFO_URL, "_blank", "location=yes");
    },

    render: function () {
      return (
        <div className="section-info smokers">
          <h1>El tabaco es la causa por la cual se produce la EPOC</h1>
          <p>
            Una vez diagnosticada la enfermedad, la medida más importante es dejar el tabaco. Esta demostrado que los pacientes
            que no dejan de fumar, tienen un peor pronóstico con la evolución de la EPOC. Esto se manifiesta en que la cantidad
            de aire que un enfermo con EPOC puede movilizar, será poco a poco menor, aumentando así la sensaciones de ahogo y axfísia.
          </p>
          <p>
            Obviamente, dejar el tabaco no sólo es beneficioso para la EPOC, también sirve para prevenir otras enfermedades frecuentes
            como el infarto de corazón, el infarto cerebral y distintos tipos de cáncer. Además supone un ahorro a largo plazo. Supongamos
            una persona que fuma un paquete al día, en un año habrá gastado aproximadamente 1.500€ en tabaco.
          </p>
          <h1>Dejar de fumar</h1>
          <p>
            Si has decidido dejar de fumar, ¡estupendo!. Es muy importante que te marques una fecha dentro de las próximas semanas. <b>Elige un día</b> que
            pienses que no vaya a ser demasiado complicado, si prefieres un lunes, o un domingo...
          </p>
          <p>
            Se deja de fumar de un día para otro. <b>Dejarlo «poco a poco», suprimiendo cada día algunos cigarrillos, no suele ser eficaz</b>.
            Es mejor y más fácil dejar de fumar todo a partir de la fecha que te has marcado.
          </p>
          <p>
            El día anterior a dejar de fumar debes tirar todo los cigarrillos. Si vas a dejar de fumar no necesitas tener tabaco.
            Coloca en el lugar donde guardabas el paquete de cigarrillos algún chicle o golosina. Es importante que comuniques
            la decisión a las personas que te rodean y que te pueden ayudar: tus hijos, tus amigos, tus compañeros.
            No debes tener miedo al compromiso. Vas a hacer un intento serio y definitivo para dejar de fumar y ellos serán
            cómplices que te ayudarán.
          </p>
          <p>
            Si necesitas más información, el Ministerio de Sanidad de España tiene una web dónde encontrarás todas aquellas
            dudas que te surjan.
          </p>
          <materialViews.RippleButton
            extraCSSClasses={{"btn-info": true}}
            fullWidth={true}
            handleClick={this.openURL}
            label="Acceder al Ministerio de Sanidad" />
        </div>
      );
    }
  });

  var ChartView = React.createClass({
    mixins: [
      StoreMixin("bloodSaturationStore")
    ],

    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
    },

    getInitialState: function() {
      return _.extend(this.getStore().getStoreState(), {
        addModeEnabled: false,
        hasValue: false,
        isValid: true
      });
    },

    componentDidMount: function() {
      // Creates a empty chart
      this._createChart();
    },

    _createChart: function() {
      var ctx = this.refs.chart.getDOMNode()
      var bloodSaturationData = this._prepareData(this.state.data);
      this._chartData = bloodSaturationData;
      this._chart = new Chart(ctx, {
        type: 'line',
        data: bloodSaturationData,
        options: {
          scales: {
            yAxes: [{
              ticks: {
                maxTicksLimit: 3,
                stepSize: 10,
                max: 110,
                min: 80
              }
            }],
            xAxes: [{
              display: false
            }]
          }
        }
      });
    },

    _prepareData: function(data) {
      var chartData = {
        labels: [],
        datasets: [{
          label: "Saturación en sangre",
          data: [],
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)"
        }]
      };

      this._noDataFetched = !data.length;

      data.forEach(function(bloodSaturation) {
        var date = new Date(bloodSaturation.date);
        var formatedDate = DateTimeHelper.format(date, {fullDate: true});
        chartData.labels.push(formatedDate);
        chartData.datasets[0].data.push(bloodSaturation.value);
      });

      return chartData;
    },

    _updateChart: function(data) {
      if (!this._chartData) {
        return;
      }

      var formatedDate = DateTimeHelper.format(data.date, {fullDate: true});
      this._chartData.labels.push(formatedDate);
      this._chartData.datasets[0].data.push(data.value);
      this._chart.update();
    },

    componentWillUpdate: function(nextProps, nextState) {
      // Add data to the chart for the first time when data has been fetched from db
      if (this._noDataFetched && nextState.data.length) {
        this._createChart();
        return;
      }
    },

    isValid: function(isValid) {
      this.setState({
        isValid: isValid
      });
    },

    hasValue: function(hasValue) {
      this.setState({
        hasValue: hasValue
      });
    },

    toggleAddMode: function() {
      if (this.state.addModeEnabled && this.state.hasValue && this.state.isValid) {
        var newData = {
          date: new Date(),
          value: this.refs.addView.getBloodSaturationData()
        };
        this.props.dispatcher.dispatch(new Actions.AddBloodSaturation(newData));
        this._updateChart(newData);
      }

      this.setState({
        addModeEnabled: !this.state.addModeEnabled
      });
    },

    render: function() {
      var icon = "add.svg";
      var iconCSSClasses = {
        "add-button": true
      };
      var disabled = this.state.hasValue && !this.state.isValid;

      if (this.state.addModeEnabled) {
        icon = "check.svg";
        if (!this.state.hasValue) {
          icon = "clear.svg";
        }
      }

      return (
        <div className="epoc-chart">
          <h1>Saturación de oxígeno en sangre</h1>
          <p>
            Es la medida de la cantidad de oxígeno disponible en el torrente sanguíneo. Cuando la sangre se
            bombea desde el corazón al cuerpo, primero pasa a través de los pulmones, donde las moléculas de oxígeno
            se unen a las células rojas de la sangre (eritrocitos) con el fin de ser llevado al resto del cuerpo. El
            porcentaje de eritrocitos que están completamente saturados con oxígeno se conoce como saturación arterial de
            oxígeno o nivel de oxígeno en sangre.
          </p>
          <canvas ref="chart"></canvas>
          <materialViews.FloatActionButton
            disabled={disabled}
            extraCSSClasses={iconCSSClasses}
            handleClick={this.toggleAddMode}>
            <img src={"img/material/" + icon} />
          </materialViews.FloatActionButton>
          <AddBloodSaturationView
            hasValue={this.hasValue}
            isValid={this.isValid}
            ref="addView"
            show={this.state.addModeEnabled} />
        </div>
      );
    }
  });

  var AddBloodSaturationView = React.createClass({
    propTypes: {
      hasValue: React.PropTypes.func.isRequired,
      isValid: React.PropTypes.func.isRequired,
      show: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
      return {
        data: null
      };
    },

    getBloodSaturationData: function() {
      return this.state.data;
    },

    handleFieldChange: function(value) {
      this.setState({
        data: value
      });
    },

    render: function() {
      return (
        <SlideScreenView
          show={this.props.show}>
          <h1>Añadir nuevo valor de saturación</h1>
          <p>
            Si has acudido a tu médico y te han tomado las medidas de la saturación de oxígeno en sangre, añadelas
            a la aplicación para visualizar tu evolución a lo largo del tiempo y comparar tu estado con la franja
            ideal de tu saturación en sangre.
          </p>
          <materialViews.Input
            hasValue={this.props.hasValue}
            inputName={"blood-saturation"}
            isValid={this.props.isValid}
            label={"Saturación en sangre"}
            minValue={0}
            maxValue={100}
            onChange={this.handleFieldChange}
            type={"number"} />
        </SlideScreenView>
      );
    }
  });

  var SlideScreenView = React.createClass({
    propTypes: {
      children: React.PropTypes.node.isRequired,
      show: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
      return {
        show: this.props.show
      };
    },

    componentWillReceiveProps: function(nextProps) {
      this.setState({
        show: nextProps.show
      });
    },

    componentDidUpdate: function() {
      if (this.state.show) {
        setTimeout(function() {
          if (!this.getDOMNode()) {
            return;
          }

          this.getDOMNode().classList.add("open");
        }.bind(this), 10);
      }
    },

    render: function() {
      if (!this.state.show) {
        return null;
      }
      return (
        <div className="add-form">
          <div className="add-form-wrapper">
          {this.props.children}
          </div>
        </div>
      );
    }
  });

  return {
    ChartView: ChartView,
    ChoiceButton: ChoiceButton,
    ChoicesView: ChoicesView,
    EPOCAndSmokersView: EPOCAndSmokersView,
    ExacerbationsView: ExacerbationsView,
    InhalersView: InhalersView,
    LoaderView: LoaderView,
    MyAlarmsView: MyAlarmsView,
    UserProfileView: UserProfileView,
    WhatIsEpocView: WhatIsEpocView
  };
});
