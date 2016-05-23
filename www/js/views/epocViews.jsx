define([
  "build/materialViews",
  "build/nutritionTest",
  "utils/dispatcher",
  "utils/actions",
  "utils/utilities",
  "utils/dateTime",
  "mixins/storeMixin",
  "Chart",
  "_"], function(materialViews, nutritionTestViews, Dispatcher, Actions, utils, DateTimeHelper, StoreMixin, Chart, _) {
  "use strict";

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
            label="Respiración ruidosa">
            <p>
              Al respirar normalmente suenan ruidos estraños. Estos ruidos pueden deberse a mocos o pús en las vías respiratorias
              o quizá líquido en los pulmones.
            </p>
          </materialViews.DropdownView>
          <materialViews.DropdownView
            label="Respiración irregular">
            <p>
              Sientes que debes usar los músculos del pecho para respirar en vez del diafragma, causando una respiración
              irregular.
            </p>
          </materialViews.DropdownView>
          <materialViews.DropdownView
            label="Cambios en la piel o las uñas">
            <p>
              El cambio de color de la piel a un tono grisáceo o amarillento así como un tinte azulado alrededor de los labios
              y las uñas se tornan de un color azulado o púrpura.
            </p>
          </materialViews.DropdownView>
          <materialViews.DropdownView
            label="Problemas comiendo o durmiendo">
            <p>
              Si no puedes dormir o tienes problemas para comer es posible que sean debido a tus ahogos. Deberías hablarlo con
              especialista.
            </p>
          </materialViews.DropdownView>
          <materialViews.DropdownView
            label="Dolores de cabeza">
            <p>
              Los dolores de cabeza al despertar suelen deberse a los bajos niveles de oxígeno en tu sangre, que produce una
              acumulación de dióxido de carbono en la sangre.
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
            if (!newValue) {
              return;
            }

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
                maxValue={250}
                minValue={40}
                type="input"
                inputType="number"
                units="kilos"
                ref="weight" />
              <EditableField
                isEditModeActive={this.state.editMode}
                label={this.state.height.toString()}
                maxValue={220}
                minValue={90}
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
      maxValue: React.PropTypes.number,
      minValue: React.PropTypes.number,
      type: React.PropTypes.oneOf(["input", "select"]).isRequired,
      inputType: React.PropTypes.string,
      units: React.PropTypes.string,
      values: React.PropTypes.array
    },

    getInitialState: function() {
      return {
        newValue: (this.props.type === "input" ? this.props.label : this.props.currentValue),
        isValid: true
      }
    },

    getNewValue: function() {
      if (!this.state.isValid) {
        return "";
      }

      return this.state.newValue;
    },

    handleFieldChange: function(value) {
      this.setState({
        newValue: value
      });
    },

    componentWillReceiveProps: function(nextProps) {
      if (this.props.isEditModeActive && !nextProps.isEditModeActive && !this.state.isValid) {
        this.setState({
          newValue: (this.props.type === "input" ? this.props.label : this.props.currentValue),
          isValid: true
        });
      }
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

    isValid: function (valid) {
      this.setState({
        isValid: valid
      });
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
                isValid={this.isValid}
                maxValue={this.props.maxValue}
                minValue={this.props.minValue}
                onChange={this.handleFieldChange}
                required={true}
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
        editModeEnabled: false,
        isValid: false
      });
    },

    toggleAddMode: function() {
      // Handle edit mode
      if (this.state.editModeEnabled) {
        this.setState({
          alarmToEdit: null,
          editModeEnabled: !this.state.editModeEnabled
        });
        return;
      }

      this.setState({
        addModeEnabled: !this.state.addModeEnabled
      });
    },

    enterEditMode: function(alarmData) {
      this.setState({
        alarmToEdit: alarmData,
        editModeEnabled: !this.state.editModeEnabled
      });
    },

    isValid: function(valid) {
      this.setState({
        isValid: valid
      });
    },

    onClose: function(alarmData, update) {
      if (!this.state.isValid) {
        return;
      }

      var alarmDate = new Date();
      alarmDate.setHours(alarmData.time.hours);
      alarmDate.setMinutes(alarmData.time.minutes);
      alarmDate.setSeconds(0);

      if (update) {
        this.props.dispatcher.dispatch(new Actions.UpdateAlarm({
          id: alarmData.id,
          title: alarmData.title,
          at: alarmDate,
          // Hours to minutes
          every: parseInt(alarmData.periodicity) * 60
        }));
      } else {
        this.props.dispatcher.dispatch(new Actions.ScheduleAlarm({
          title: alarmData.title,
          text: "",
          at: alarmDate,
          // Hours to minutes
          every: parseInt(alarmData.periodicity) * 60,
          type: utils.ALARM_TYPES.MEDICINE
        }));
      }
    },

    render: function() {
      var icon = "add.svg";
      var iconCSSClasses = {
        "add-button": true
      };

      if (this.state.addModeEnabled || this.state.editModeEnabled) {
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
                  handleEditAlarm={this.enterEditMode}
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
            alarm={this.state.alarmToEdit}
            isValid={this.isValid}
            onClose={this.onClose}
            show={this.state.addModeEnabled || this.state.editModeEnabled} />
        </div>
      );
    }
  });

  var AlarmView = React.createClass({
    propTypes: {
      alarm: React.PropTypes.object.isRequired,
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      handleEditAlarm: React.PropTypes.func.isRequired
    },

    cancelAlarm: function() {
      this.props.dispatcher.dispatch(new Actions.CancelAlarm({
        id: this.props.alarm.id
      }));
    },

    handleAlarmClick: function() {
      var data = JSON.parse(this.props.alarm.data);
      if (data.type === utils.ALARM_TYPES.SYSTEM) {
        this.props.dispatcher.dispatch(new Actions.ShowSnackbar({
          label: "No puedes editar una alarma del sistema"
        }));
        return;
      }
      this.props.handleEditAlarm(this.props.alarm);
    },

    render: function() {
      var date = new Date(this.props.alarm.at * 1000);
      var time = DateTimeHelper.formatTime(date);
      var periodicity = this.props.alarm.every/60;

      var data = JSON.parse(this.props.alarm.data);
      if (data.type === utils.ALARM_TYPES.SYSTEM) {
        periodicity = DateTimeHelper.minutesToMonths(this.props.alarm.every * 60).month;
      }

      return (
        <div className="alarm">
          <div className="alarm-info">
            <materialViews.RippleButton
              extraCSSClasses={{"borderless": true, "edit-alarm-btn": true}}
              handleClick={this.handleAlarmClick}>
              <h2>{this.props.alarm.title}</h2>
              <span>
                {time + " - Repetir cada " + periodicity + (data.type === utils.ALARM_TYPES.SYSTEM ? " meses" : " horas")}
              </span>
            </materialViews.RippleButton>
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
      alarm: React.PropTypes.object,
      isValid: React.PropTypes.func.isRequired,
      onClose: React.PropTypes.func,
      show: React.PropTypes.bool.isRequired
    },

    getInitialState: function() {
      return {
        data: {
          title: null,
          periodicity: 2,
          time: {
            hours: null,
            minutes: null
          }
        },
        showTimePicker: false,
        valid: {
          title: false,
          time: false
        }
      };
    },

    componentWillReceiveProps: function(nextProps) {
      // there's no need to upload state again
      if (this.props.show === nextProps.show) {
        return;
      }

      if (this.props.show && !nextProps.show) {
        this.props.onClose && this.props.onClose(this.state.data, !!this.props.alarm);
        return;
      }

      if (nextProps.alarm) {
        var data = this.state.data;
        data.title = nextProps.alarm.title;
        data.periodicity = nextProps.alarm.every/60;
        var alarmDate = new Date(1000*nextProps.alarm.at);
        data.time.hours = alarmDate.getHours();
        data.time.minutes = alarmDate.getMinutes();
        data.id = nextProps.alarm.id;
        // We have a valid alarm so let's update the valid state
        this.setState({
          valid: {
            title: true,
            time: true
          },
          data: data
        });
      } else {
        // Need to reset the state
        this.setState({
          data: {
            title: null,
            periodicity: 2,
            time: {
              hours: null,
              minutes: null
            }
          },
          showTimePicker: false,
          valid: {
            title: false,
            time: false
          }
        });
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
      var title = this.state.data.title;
      var periodicity = this.state.data.periodicity;
      var alarmDate = this.state.data.time;
      var time = null;

      if (alarmDate.hours !== null && alarmDate.minutes !== null) {
        var hours = alarmDate.hours > 10 ? alarmDate.hours : "0" + alarmDate.hours;
        var minutes = alarmDate.minutes > 10 ? alarmDate.minutes : "0" + alarmDate.minutes;
        time = hours + ":" + minutes;
      }

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
            type={"text"}
            value={title} />
          <h2>¿Cada cuanto tienes que tomar la medicación?</h2>
          <materialViews.SelectView
            currentValue={periodicity}
            onChange={this.handlePeriodicityChange}
            selectName={"alarm-periodicity"}
            values={this.constructor.PERIODICITY_VALUES} />
          <h2>¿A qué hora?</h2>
          <materialViews.Input
            hasValue={this.props.hasValue}
            inputName={"alarm-time"}
            label={"Hora de la alarma"}
            onFocus={this.handleOnFocus}
            type={"time"}
            value={time} />
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
      var ctx = this.refs.chart
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
          if (!ReactDOM.findDOMNode(this)) {
            return;
          }

          ReactDOM.findDOMNode(this).classList.add("open");
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

  var MyNutritionView = React.createClass({
    mixins: [
      StoreMixin("userStore")
    ],

    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      navigate: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return _.extend(this.getStore().getStoreState(), {
        showTestWarning: false
      });
    },

    componentWillMount: function() {
      var lastTest = localStorage.getItem("nutritionTest");
      if (!lastTest) {
        return;
      }

      var lastTestDate = new Date(parseInt(lastTest));
      var nextTestDate = DateTimeHelper.addMonths(lastTestDate, 3);

      var today = new Date();
      if (today.getTime() >= nextTestDate.getTime()) {
        this.setState({
          showTestWarning: true
        });
      }
    },

    skipTest: function() {
      this.setState({
        showTestWarning: false
      });
    },

    goToTest: function() {
      this.props.navigate("#nutrition-test");
    },

    navigateTo: function (section) {
      this.props.navigate("#my-nutrition/" + section);
    },

    renderNavigationButton: function (label, section) {
      var self = this;
      var navigateWrapperFunc = function() {
        self.navigateTo(section);
      };
      return (
        <materialViews.RippleButton
          extraCSSClasses={{"borderless": true, "nutrition-tips-btn": true}}
          fullWidth={true}
          handleClick={navigateWrapperFunc}
          label={label} />
      );
    },

    render: function() {
      if (this.props.router.sectionId) {
        switch (parseInt(this.props.router.sectionId)) {
          case 0:
            return (
              <ReduceSodiumView />
            );
          case 1:
            return (
              <GeneralTipsView />
            );
          case 2:
            return (
              <PersonalTipsView
                bmi={this.state.bmi} />
            );
          default:
            return null;
        }
      }

      if (!this.state.nutritionScore) {
        return (
          <nutritionTestViews.NutritionTestController
            dispatcher={this.props.dispatcher}
            router={this.props.router} />
        );
      }

      if (this.state.showTestWarning) {
        return (
          <div className="section-info">
            <div className="nutrition-test-warning">
              <span className="nutrition-test-icon"></span>
              <h1>Test de nutrición</h1>
              <p>
                Hace más de tres meses que no realizas el test. ¿Por qué no lo realizas para comprobar tu progreso?
              </p>
              <materialViews.RippleButton
                handleClick={this.goToTest}
                label="Realizar ahora" />
              <materialViews.RippleButton
                extraCSSClasses={{"btn-dark": true}}
                handleClick={this.skipTest}
                label="Más tarde" />
            </div>
          </div>
        );
      }

      return (
        <div className="section-info">
          <h1>
            La nutrición y la EPOC
          </h1>
          <p>
            Es común ver en los pacientes de EPOC, una alteración del peso, generalmente
            acompañado de una disminución de la masa muscular y un aumento de la
            masa grasa.
          </p>
          <p>
            Esto sucede porque al consumir más oxigeno y a mayor trabajo
            respiratorio, el organismo necesita más energía, que acompañado de
            pérdida de apetito, cansancio y tos frecuente, hacen que muchas veces,
            los pacientes tengan dificultades para cubrir los requerimientos de
            nutrientes y energía que el cuerpo necesita. Así, los músculos respiratorios
            tienen menos fuerza y resistencia para la contracción.
          </p>
          <h2>¿Sabías que...?</h2>
          <p>
            La ingesta de sal puede producir retención de líquidos dificultando la respiración. Por ello debes vigilar
            tus niveles de sodio en la dieta. Aquí tienes unos consejos prácticos:
          </p>
          {
            this.renderNavigationButton("Reducir la sal en la dieta", 0)
          }
          <h2 className="no-margin">El calcio</h2>
          <p>
            El uso de ciertos medicamentos puede disminuir la utilización de calcio
            por el organismo, por eso es recomendable aumentar la ingesta de los
            alimentos, ricos en calcio.
          </p>
          <p>
            Procura beber mucha leche, consumir lácteos como el queso o los yogures, así como comer legumbres.
          </p>
          <div className="img-caption-group">
            <img src="img/dairy_products.png" />
            <span className="caption">Alimentos ricos en calcio</span>
          </div>
          <h2>Consejos para la dieta</h2>
          {
            this.renderNavigationButton("Consejos generales", 1)
          }
          {
            this.state.bmi.value < 18.5 || this.state.bmi.value >= 25 ?
            this.renderNavigationButton("Consejos adaptados a ti", 2) : null
          }
        </div>
      );
    }
  });

  var ReduceSodiumView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>Consejos para reducir el sodio en tu dieta</h1>
          <p>
            A continuación tienes unos consejos que te ayudarán a reducir y controlar los niveles de sodio
            en tu dieta diaria. <b>Recuerda respetar siempre las recomendaciones de tu médico.</b>
          </p>
          <ol className="tip-list">
            <li>
              <span>
                Evitar llevar la sal a la mesa.
              </span>
            </li>
            <li>
              <span>
                Realizar la cocción de los alimentos sin agregar sal.
              </span>
            </li>
            <li>
              <span>
                Usar variedad de condimentos en reemplazo de la sal (orégano, pimienta, comino, etc.).
              </span>
            </li>
            <li>
              <span>
                Utilizar limón para darle gusto a la comida.
              </span>
            </li>
            <li>
              <span>
                Probar las comidas antes de salarlas y en el caso de querer condimentarlas, realizarlo con
                una cucharada tipo café en cada comida principal.
              </span>
            </li>
            <li>
              <span>
                Seleccionar correctamente los alimentos evitando los de alto contenido como: Sal fina, sal gruesa,
                sales de especies, quesos frescos y duros, fiambres, embutidos, picadillos, paté, sopas envasadas,
                galletitas con sal, galletitas dulces, pastas rellenas, pizzas y comidas compradas, masa de tarta
                y empanadas, alimentos envasados en salmuera, aderezos
                (mayonesa, ketchup, etc.), bebidas alcohólicas y gaseosas.
              </span>
            </li>
          </ol>
        </div>
      );
    }
  });

  var GeneralTipsView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>Consejos para mejorar tu nutrición</h1>
          <p>
            Mejorar tu nutrición hará que te sientas mejor y puedas tener una vida más plena
            dentro de tus limitaciones. <b>Recuerda respetar siempre las recomendaciones de tu médico.</b>
          </p>
          <ol className="tip-list">
            <li>
              <span>
                Comer varias veces al día, por lo menos 6 comidas, en pequeñas cantidades, <b>¡nada de atracones!</b>
              </span>
            </li>
            <li>
              <span>
                Si utilizas oxigeno, asegúrate de usarlo durante y después de la
                comida. El acto de comer y la digestión requieren de energía,
                lo que aumenta la necesidad de oxígeno.
              </span>
            </li>
            <li>
              <span>
                Elegir alimentos que sean fáciles de preparar. Trata de
                descansar antes de comer para evitar la falta de oxígeno.
              </span>
            </li>
            <li>
              <span>
                Elegir preparaciones de consistencia blanda.
              </span>
            </li>
            <li>
              <span>
                Comer despacio y masticar bien la comida. Tómate tu tiempo, no hay prisa por acabar de comer.
              </span>
            </li>
            <li>
              <span>
                Si tienes gases y/o se siente hinchado, evitar alimentos
                productores de gas como: legumbres (lentejas, garbanzos...), coles (Brócoli, coliflor, repollo), vegetales
                feculentos (patata, batata...), vegetales de hoja
                crudos (acelga, espinaca, lechuga...) y bebidas con gas.
              </span>
            </li>
            <li>
              <span>
                Tomar abundante líquido, pero alejados de las comidas o al
                finalizarlas
              </span>
            </li>
            <li>
              <span>
                Limitar la ingesta de sal, el exceso de sodio puede hacer
                retener líquidos lo que puede dificultar la respiración.
              </span>
            </li>
            <li>
              <span>
                Limitar el consumo de bebidas con cafeína que pueden
                interferir con alguno de tus medicamentos y pueden hacer que
                se sienta nervioso
              </span>
            </li>
          </ol>
        </div>
      );
    }
  });

  var PersonalTipsView = React.createClass({
    propTypes: {
      bmi: React.PropTypes.object.isRequired
    },

    shouldComponentUpdate: function() {
      return false;
    },

    renderLowerBoundInfo: function() {
      return (
        <div>
          <ol className="tip-list">
            <li>
              <span>
                Incorporar una cucharada sopera de leche en polvo a la leche fluida (ya sea sola o en infusiones).
              </span>
            </li>
            <li>
              <span>
                Enriquecer los platos principales con queso (untable, fresco o de rallar descremados) en platos
                como puré, ensaladas, carnes, pastas, budines, arroz, etc
              </span>
            </li>
            <li>
              <span>
                Adicionar clara de huevo a todas las preparaciones posibles.
              </span>
            </li>
            <li>
              <span>
                Consumir vegetales preferentemente cocidos (al horno, hervidos, asados, en forma de soufflés,
                croquetas, buñuelos, purés, etc.) ya que dan menos saciedad que las verduras crudas aunque
                éstas también pueden ingerirse.
              </span>
            </li>
            <li>
              <span>
                Al igual que los vegetales; preferir frutas cocidas como por ejemplo manzana asada, compota,
                tartas, tortas, etc.
              </span>
            </li>
            <li>
              <span>
                Realizar ingestas con mas frecuencia y en pequeñas cantidades.
              </span>
            </li>
          </ol>
          <p>
            <b>Evaluar con tu nutricionista la posibilidad de un suplemento dietario en el caso que sea necesario.</b>
          </p>
        </div>
      );
    },

    renderUpperBoundInfo: function() {
      return (
        <div>
          <ol className="tip-list">
            <li>
              <span>
                Seleccionar leche, yogur y quesos descremados.
              </span>
            </li>
            <li>
              <span>
                Reemplazar el azúcar por edulcorante.
              </span>
            </li>
            <li>
              <span>
                Consumir 1 huevo 2 a 3 veces por semana.
              </span>
            </li>
            <li>
              <span>
                Seleccionar cortes de carnes magros (peceto, lomo, nalga, bola de lomo, cuadrada, roast beef,
                y carne picada de cortes magros) y retirar la grasa visible. Pollo sin piel, preferentemente pechuga.
                Pescados: merluza, atún al natural, brótola, lenguado, caballa, abadejo, pollo de mar, pez palo, jurel.
              </span>
            </li>
            <li>
              <span>
                Utilizar el aceite en crudo.
              </span>
            </li>
            <li>
              <span>
                Aumentar el consumo de fibra (Cereales integrales, verduras, frutas especialmente con cáscara)
                para regular el tránsito intestinal, y evitar la compresión del tórax por la constipación.
              </span>
            </li>
            <li>
              <span>
                Incorporar los vegetales en las 2 comidas principales, preferentemente crudos para aumentar la saciedad y la fibra.
              </span>
            </li>
            <li>
              <span>
                Elegir frutas frescas como postre preferiblemente crudas y con cáscara.
              </span>
            </li>
            <li>
              <span>
                Consumir al menos 2 litros de agua por día; evitar las bebidas azucaradas.
              </span>
            </li>
          </ol>
          <p>
            <b>Consulta a tu nutricionista para normalizar tu peso.</b>
          </p>
        </div>
      );
    },

    render: function() {
      return (
        <div className="section-info">
          <h1>Consejos para mejorar tu nutrición</h1>
          <p>
            La EPOC y la nutrición estan fuertemente ligadas, por eso es recomendable cuidar el máximo posible la alimentación
            que llevamos día a día. A continuación tienes una serie de consejos adaptados a tus
            necesidades. <b>Recuerda respetar siempre las recomendaciones de tu médico.</b>
          </p>
          {
            this.props.bmi.value < 18.5 ?
              this.renderLowerBoundInfo() :
              this.renderUpperBoundInfo()
          }
        </div>
      );
    }
  });

  var NutritionTestView = React.createClass({
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired,
      router: React.PropTypes.object.isRequired
    },

    render: function() {
      return (
        <nutritionTestViews.NutritionTestController
          dispatcher={this.props.dispatcher}
          router={this.props.router} />
      );
    }
  });

  return {
    ChartView: ChartView,
    EPOCAndSmokersView: EPOCAndSmokersView,
    ExacerbationsView: ExacerbationsView,
    InhalersView: InhalersView,
    MyAlarmsView: MyAlarmsView,
    MyNutritionView: MyNutritionView,
    NutritionTestView: NutritionTestView,
    UserProfileView: UserProfileView,
    WhatIsEpocView: WhatIsEpocView
  };
});
