define(["utils/dateTime", "utils/utilities", "mixins/storeMixin", "_"], function(DateTimeHelper, utils, StoreMixin, _) {
  "use strict";

  var RippleButton = React.createClass({
    statics: {
      ANIMATION_DELAY: 750
    },

    propTypes: {
      children: React.PropTypes.node,
      disabled: React.PropTypes.bool,
      extraCSSClasses: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ]),
      fullWidth: React.PropTypes.bool,
      handleClick: React.PropTypes.func,
      label: React.PropTypes.string,
      model: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
        React.PropTypes.bool
      ]),
      style: React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        disabled: false,
        fullWidth: false
      };
    },

    componentDidMount: function() {
      ReactDOM.findDOMNode(this).addEventListener("touchstart", this.onTouchStart);
    },

    onTouchStart: function(event) {
      var elementBoundingClientRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
      var rippleElement = ReactDOM.findDOMNode(this).querySelector(".ripple-effect");
      var diagonal;
      var x, y;
      // Stop the previous animation in case of a
      // quick double click
      rippleElement.classList.remove('animate');

      // If it's the first time the user click the button,
      // width and height parameters must be set
      if (!rippleElement.clientHeight ||
        !rippleElement.clientWidth) {
        diagonal =
          Math.max(elementBoundingClientRect.height,
            elementBoundingClientRect.width);

        rippleElement.style.height = diagonal + 'px';
        rippleElement.style.width = diagonal + 'px';
      }

      x = event.touches[0].clientX -
        elementBoundingClientRect.left - diagonal/2;
      y = event.touches[0].clientY -
        elementBoundingClientRect.top - diagonal/2;

      rippleElement.style.top = y + 'px';
      rippleElement.style.left = x + 'px';

      rippleElement.classList.add('animate');
      setTimeout(function() {
        rippleElement.classList.remove('animate');
      }, this.constructor.ANIMATION_DELAY);
    },

    handleClick: function(event) {
      this.props.handleClick && this.props.handleClick(event, this.props.model);
    },

    render: function() {
      var cssClasses = {
        "material-button": true,
        "btn-full-width": this.props.fullWidth
      };

      if (this.props.extraCSSClasses) {
        typeof this.props.extraCSSClasses === "object" ?
          _.extend(cssClasses, this.props.extraCSSClasses) :
          cssClasses[this.props.extraCSSClasses] = true;
      }

      return (
        <button
          className={classNames(cssClasses)}
          onClick={this.handleClick}
          disabled={this.props.disabled}
          data-model={this.props.model}
          style={this.props.style}>
          <span className="ripple-effect"></span>
          {this.props.children}
          {this.props.label}
        </button>
      );
    }
  });

  var Input = React.createClass({
    propTypes: {
      hasValue: React.PropTypes.func,
      inputName: React.PropTypes.string.isRequired,
      isValid: React.PropTypes.func,
      label: React.PropTypes.string,
      maxLength: React.PropTypes.number,
      maxValue: React.PropTypes.number,
      minValue: React.PropTypes.number,
      onChange: React.PropTypes.func,
      onFocus: React.PropTypes.func,
      required: React.PropTypes.bool,
      type: React.PropTypes.string,
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ])
    },

    getDefaultProps: function () {
      return {
        required: false,
        type: "text"
      };
    },

    getInitialState: function () {
      return {
        invalid: false,
        touched: false,
        focused: false,
        hasValue: false,
        value: this.props.value ? this.props.value : ""
      }
    },

    componentWillReceiveProps: function(nextProps) {
      if (!this.props.value && nextProps.value) {
        this.setInputValue(nextProps.value);
      }
    },

    componentDidMount: function() {
      // Render char counter if needed at the initialize
      this.renderCharCount();
      this.validateInput();
    },

    onFocus: function() {
      this.setState({
        touched: true,
        focused: true
      });

      this.props.onFocus && this.props.onFocus();
    },

    onBlur: function() {
      this.setState({
        focused: false
      });
    },

    setInputValue: function(value) {
      var input = ReactDOM.findDOMNode(this).querySelector(".form-control");
      var attr = "value";
      if (this.props.type === "date" || this.props.type === "time") {
        attr = "textContent";
      }

      input[attr] = value;
      this.validateInput();
    },

    renderCharCount: function() {
      var input = ReactDOM.findDOMNode(this).querySelector("input");
      var charCounterElement = ReactDOM.findDOMNode(this).querySelector(".material-char-counter");
      if (charCounterElement) {
        charCounterElement.textContent = String(input.value || '').length + '/' + this.props.maxLength;
      }
      this.validateInput();
    },

    renderMaxLengthView: function() {
      return (
        <div className="material-char-counter"></div>
      );
    },

    validateInput: function () {
      var input = ReactDOM.findDOMNode(this).querySelector(".form-control");
      var attr = this.props.type === "date" || this.props.type === "time" ? "textContent" : "value";
      var hasValue = input[attr].length !== 0;
      var valid = true;

      var rangeValid = this._upperBoundValid(input[attr]) && this._lowerBoundValid(input[attr]);

      if (input.hasAttribute("required") && !hasValue) {
        this.setState({
          invalid: true,
          hasValue: hasValue
        });
        valid = false;
      } else if ((this.props.maxValue || this.props.minValue) && !rangeValid) {
        this.setState({
          invalid: true,
          hasValue: hasValue
        });
        valid = false;
      } else {
        this.setState({
          invalid: false,
          hasValue: hasValue
        });
      }

      this.props.isValid && this.props.isValid(valid);
      this.props.hasValue && this.props.hasValue(hasValue);
    },

    _upperBoundValid: function(value) {
      if (!this.props.maxValue) {
        return true;
      }

      return this.props.maxValue >= value;
    },

    _lowerBoundValid: function(value) {
      if (!this.props.minValue) {
        return true;
      }

      return this.props.minValue <= value;
    },

    onChange: function(event) {
      this.setState({
        value: event.target.value
      });

      this.props.onChange && this.props.onChange(event.target.value);
    },

    render: function() {
      var classes = classNames({
        "material-input-wrapper": true,
        "touched": this.state.touched,
        "is-invalid": this.state.invalid,
        "focused": this.state.focused,
        "has-value": this.state.hasValue
      });
      return (
        <div className={classes}>
          <label>{this.props.label}</label>
          {
            this.props.type === "date" || this.props.type === "time" ?
              <div
                className="form-control"
                onClick={this.props.onFocus}
                required={this.props.required ? true : false}>{this.props.value}</div> :
              <input className="form-control"
                     maxLength={this.props.maxLength}
                     name={this.props.inputName}
                     onBlur={this.onBlur}
                     onChange={this.onChange}
                     onFocus={this.onFocus}
                     onInput={this.renderCharCount}
                     onKeyUp={this.renderCharCount}
                     required={this.props.required ? true : false}
                     type={this.props.type === "date" || this.props.type === "time" ? "text" : this.props.type}
                     value={this.state.value} />
          }
          {this.props.maxLength ? this.renderMaxLengthView() : null}
        </div>
      );
    }
  });

  var SelectView = React.createClass({
    propTypes: {
      currentValue: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      onChange: React.PropTypes.func,
      selectName: React.PropTypes.string.isRequired,
      values: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
      return {
        value: this.props.currentValue || ""
      };
    },

    onChange: function(event) {
      this.setState({
        value: event.target.value
      });

      this.props.onChange && this.props.onChange(event.target.value);
    },

    render: function() {
      var classes = classNames({
        "material-input-wrapper": true
      });
      return (
        <div className={classes}>
          <select className="form-control"
            onChange={this.onChange}
            name={this.props.selectName}
            value={this.state.value}>
            {
              this.props.values.map(function(option, index) {
                return (
                  <option value={option.value} key={index}>{option.label}</option>
                );
              }, this)
            }
          </select>
        </div>
      );
    }
  });

  var CalendarView = React.createClass({
    statics: {
      SHOW_DELAY: 200
    },

    propTypes: {
      handleAcceptAction: React.PropTypes.func.isRequired,
      handleCancelAction: React.PropTypes.func.isRequired,
      initialDate: React.PropTypes.object,
      minDate: React.PropTypes.object,
      maxDate: React.PropTypes.object,
      showCalendar: React.PropTypes.bool.isRequired
    },

    getDefaultProps: function() {
      return {
        initialDate: new Date(),
        minDate: DateTimeHelper.addYears(new Date(), -100),
        maxDate: DateTimeHelper.addYears(new Date(), 50),
      };
    },

    getInitialState: function() {
      return {
        selectedDate: new Date(),
        yearViewActive: false,
        showCalendar: this.props.showCalendar
      }
    },

    componentDidUpdate: function() {
      if (this.state.showCalendar) {
        setTimeout(() => {
          ReactDOM.findDOMNode(this).classList.add("material-calendar-display");
        }, this.constructor.SHOW_DELAY);
      }
    },

    componentWillReceiveProps: function(newProps) {
      this.setState({
        showCalendar: newProps.showCalendar
      });
    },

    handleDayClick: function(event, day) {
      event.preventDefault();
      this.setState({
        selectedDate: day
      });
    },

    handleMonthChange: function(event, months) {
      event.preventDefault();
      this.setState({
        selectedDate: DateTimeHelper.addMonths(this.state.selectedDate, months)
      });
    },

    toggleYearView: function(event, yearViewActive) {
      event.preventDefault();
      this.setState({
        yearViewActive: yearViewActive
      });
    },

    handleYearClick: function(event, year) {
      event.preventDefault();
      var newDate = DateTimeHelper.clone(this.state.selectedDate);
      newDate.setFullYear(year);
      this.setState({
        selectedDate: newDate
      });
    },

    dismissCalendar: function() {
      this.props.handleCancelAction();
    },

    handleAcceptAction: function() {
      this.props.handleAcceptAction(this.state.selectedDate);
    },

    renderYearView: function () {
      return (
        <div className="calendar-content">
          <CalendarYearsView
            handleYearClick={this.handleYearClick}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            selectedDate={this.state.selectedDate} />
        </div>
      );
    },

    renderMonthView: function () {
      return (
        <div className="calendar-content">
          <CalendarNavigation
            handleMonthChange={this.handleMonthChange}
            selectedDate={this.state.selectedDate} />
          <CalendarHeaderView />
          <CalendarDaysView
            handleClick={this.handleDayClick}
            selectedDate={this.state.selectedDate} />
        </div>
      );
    },

    render: function() {
      if (!this.state.showCalendar) {
        return null;
      }

      return (
        <div className="material-calendar-wrapper">
          <div className="overlay"></div>
          <div className="material-calendar">
            <CalendarDateDisplay
              handleDateClick={this.toggleYearView}
              selectedDate={this.state.selectedDate}
              yearViewActive={this.state.yearViewActive} />
              {
                this.state.yearViewActive ?
                  this.renderYearView() : this.renderMonthView()
              }
            <WidgetButtons
              handleCancelAction={this.dismissCalendar}
              handleAcceptAction={this.handleAcceptAction} />
          </div>
        </div>
      );
    }
  });

  var CalendarDateDisplay = React.createClass({
    propTypes: {
      handleDateClick: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired,
      yearViewActive: React.PropTypes.bool
    },

    handleClick: function(event) {
      if (this.props.handleDateClick) {
        var target = event.target;
        var yearViewActive = false;
        if (target.dataset.view === "year") {
          yearViewActive = true;
        }

        this.props.handleDateClick(event, yearViewActive);
      }
    },

    render: function() {
      var yearCSS = {
        "calendar-year": true,
        "active": this.props.yearViewActive
      };

      var dateCSS = {
        "calendar-date": true,
        "active": !this.props.yearViewActive
      };

      return (
        <div className="material-calendar-header">
          <span className={classNames(yearCSS)} data-view="year" onClick={this.handleClick}>{this.props.selectedDate.getFullYear()}</span>
          <span className={classNames(dateCSS)} data-view="month" onClick={this.handleClick}>{DateTimeHelper.format(this.props.selectedDate)}</span>
        </div>
      );
    }
  });

  var CalendarNavigation = React.createClass({
    propTypes: {
      handleMonthChange: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired
    },

    handlePrev: function(event) {
      var target = this.refs["navigation-prev"];
      this._animateNode(target);

      this.props.handleMonthChange && this.props.handleMonthChange(event, -1);
    },

    handleNext: function(event) {
      event.preventDefault();
      var target = this.refs["navigation-next"];
      this._animateNode(target);
      this.props.handleMonthChange && this.props.handleMonthChange(event, 1);
    },

    _animateNode: function(node) {
      // New animation
      node.classList.add("animate");

      setTimeout(function() {
        // Stop animation
        node.classList.remove("animate");
      }, 650);
    },

    render: function() {
      return (
        <div className="calendar-navigation">
          <div className="navigation-left" ref="navigation-prev" onClick={this.handlePrev}>
            <span className="chevron-left"></span>
          </div>
          <span>{DateTimeHelper.formatMonth(this.props.selectedDate)}</span>
          <div className="navigation-right" ref="navigation-next" onClick={this.handleNext}>
            <span className="chevron-right"></span>
          </div>
        </div>
      );
    }
  });

  var CalendarHeaderView = React.createClass({
    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      var days = DateTimeHelper.dayAbbreviations;
      return (
        <ul className="calendar-days-header">
          {
            days.map(function(day, index) {
              return (
                <li key={index}>{day}</li>
              );
            })
          }
        </ul>
      );
    }
  });

  var CalendarDaysView = React.createClass({
    propTypes: {
      handleClick: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired
    },

    render: function() {
      var monthWeeks = DateTimeHelper.getWeekArray(this.props.selectedDate);
      return (
        <div className="calendar-days">
          {
            monthWeeks.map(function(week, index) {
              return (
                <CalendarWeekView
                  handleClick={this.props.handleClick}
                  key={index}
                  selectedDate={this.props.selectedDate}
                  week={week} />
              );
            }, this)
          }
        </div>
      );
    }
  });

  var CalendarWeekView = React.createClass({
    propTypes: {
      handleClick: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired,
      week: React.PropTypes.array.isRequired
    },

    render: function() {
      return (
        <div className="calendar-week">
          {
            this.props.week.map(function(day, index) {
              return (
                <CalendarDayButton
                  handleClick={this.props.handleClick}
                  key={index}
                  day={day}
                  selectedDate={this.props.selectedDate} />
              );
            }, this)
          }
        </div>
      );
    }
  });

  var CalendarDayButton = React.createClass({
    propTypes: {
      day: React.PropTypes.object,
      handleClick: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired
    },

    handleDayClick: function(event) {
      this.props.handleClick && this.props.handleClick(event, this.props.day);
    },

    render: function() {
      var cssClasses = {
        "calendar-day": true,
        "empty-day": !this.props.day,
        "current-day": DateTimeHelper.equals(new Date(), this.props.day),
        "selected-day": DateTimeHelper.equals(this.props.day, this.props.selectedDate)
      };
      return (
        <div className={classNames(cssClasses)} onClick={this.handleDayClick}>
          {this.props.day ? <span>{this.props.day.getDate()}</span> : null}
        </div>
      );
    }
  });

  var CalendarYearsView = React.createClass({
    propTypes: {
      handleYearClick: React.PropTypes.func,
      minDate: React.PropTypes.object.isRequired,
      maxDate: React.PropTypes.object.isRequired,
      selectedDate: React.PropTypes.object.isRequired
    },

    shouldComponentUpdate(nextProps) {
      if (this.props.selectedDate.getTime() !== nextProps.selectedDate.getTime()) {
        var oldYearRef = "year-" + this.props.selectedDate.getFullYear();
        var newYearRef = "year-" + nextProps.selectedDate.getFullYear();
        var oldYearBtn = ReactDOM.findDOMNode(this.refs[oldYearRef]);
        var newYearBtn = ReactDOM.findDOMNode(this.refs[newYearRef]);
        oldYearBtn.classList.remove("selected-year");
        newYearBtn.classList.add("selected-year");

        this._scrollToSelectedYear(newYearBtn);
      }

      return false;
    },

    componentDidMount: function() {
      var yearRef = "year-" + this.props.selectedDate.getFullYear();
      var yearBtn = ReactDOM.findDOMNode(this.refs[yearRef]);
      yearBtn.classList.add("selected-year");

      this._scrollToSelectedYear(yearBtn);
    },

    _scrollToSelectedYear: function(selectedYearNode) {
      var container = ReactDOM.findDOMNode(this);
      var containerHeight = container.clientHeight;
      var buttonHeight = selectedYearNode.clientHeight || 42;

      var scrollYOffset = (selectedYearNode.offsetTop + buttonHeight / 2) - containerHeight / 2;
      container.scrollTop = scrollYOffset;
    },

    getYearsList: function() {
      var minYear = this.props.minDate.getFullYear();
      var maxYear = this.props.maxDate.getFullYear();

      var years = [];

      for (var year = minYear; year <= maxYear; year++) {
        var ref = "year-" + year;
        var yearButton = (
          <CalendarYearButton
            handleYearClick={this.props.handleYearClick}
            key={year - minYear}
            ref={ref}
            year={year} />
        );

        years.push(yearButton);
      }

      return years;
    },

    render: function() {
      return (
        <div className="calendar-years">
          {this.getYearsList()}
        </div>
      );
    }
  });

  var CalendarYearButton = React.createClass({
    propTypes: {
      handleYearClick: React.PropTypes.func,
      year: React.PropTypes.number.isRequired
    },

    handleClick: function(event) {
      this.props.handleYearClick && this.props.handleYearClick(event, this.props.year);
    },

    render: function() {
      var cssClasses = {
        "calendar-year": true,
        "selected-year": false
      };
      return (
        <div className={classNames(cssClasses)} onClick={this.handleClick}>
          {this.props.year}
        </div>
      );
    }
  });

  var WidgetButtons = React.createClass({
    propTypes: {
      extraCSSClass: React.PropTypes.string,
      handleCancelAction: React.PropTypes.func.isRequired,
      handleAcceptAction: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      var cssClasses = {
        "widget-buttons": true
      };

      if (this.props.extraCSSClass) {
        cssClasses[this.props.extraCSSClass] = true;
      }

      return (
        <div className={classNames(cssClasses)}>
          <RippleButton
            extraCSSClasses="borderless"
            handleClick={this.props.handleCancelAction}
            label="Cancelar" />
          <RippleButton
            extraCSSClasses="borderless"
            handleClick={this.props.handleAcceptAction}
            label="Aceptar" />
        </div>
      );
    }
  });

  var TimePickerView = React.createClass({
    statics: {
      SHOW_DELAY: 200
    },

    propTypes: {
      format: React.PropTypes.oneOf([12, 24]),
      handleAccept: React.PropTypes.func,
      handleCancel: React.PropTypes.func,
      show: React.PropTypes.bool.isRequired
    },

    getDefaultProps: function() {
      return {
        format: 24
      };
    },

    getInitialState: function() {
      var currentTime = new Date();
      return {
        selectedHour: currentTime.getHours(),
        selectedMinute: currentTime.getMinutes(),
        showTimePicker: this.props.show
      };
    },

    componentDidUpdate: function() {
      if (this.state.showTimePicker) {
        setTimeout(() => {
          ReactDOM.findDOMNode(this).classList.add("material-time-picker-display");
        }, this.constructor.SHOW_DELAY);
      }
    },

    componentWillReceiveProps: function(newProps) {
      this.setState({
        showTimePicker: newProps.show
      });
    },

    handleHourClick: function(event, hour) {
      this.setState({
        selectedHour: hour
      });
    },

    handleMinuteClick: function(event, minute) {
      this.setState({
        selectedMinute: minute
      });
    },

    handleAccept: function() {
      this.props.handleAccept && this.props.handleAccept(this.state.selectedHour, this.state.selectedMinute);
    },

    handleCancel: function() {
      this.props.handleCancel && this.props.handleCancel();
    },

    render: function() {
      if (!this.state.showTimePicker) {
        return null;
      }

      var hours = this.state.selectedHour < 10 ? "0" + this.state.selectedHour : this.state.selectedHour;
      var minutes = this.state.selectedMinute < 10 ? "0" + this.state.selectedMinute : this.state.selectedMinute;

      return (
        <div className="material-time-picker-wrapper">
          <div className="material-time-picker">
            <div className="time-picker-header">
              <span className="info">Hora seleccionada</span>
              <h1 className="selected-time">
                {hours + " : " + minutes}
              </h1>
            </div>
            <TimeSpinnerView
              format={this.props.format}
              handleHourClick={this.handleHourClick}
              handleMinuteClick={this.handleMinuteClick}
              selectedHour={this.state.selectedHour}
              selectedMinute={this.state.selectedMinute} />
            <WidgetButtons
              handleAcceptAction={this.handleAccept}
              handleCancelAction={this.handleCancel} />
          </div>
        </div>
      );
    }
  });

  var TimeSpinnerView = React.createClass({
    propTypes: {
      format: React.PropTypes.oneOf([12, 24]).isRequired,
      handleHourClick: React.PropTypes.func.isRequired,
      handleMinuteClick: React.PropTypes.func.isRequired,
      selectedHour: React.PropTypes.number,
      selectedMinute: React.PropTypes.number,
    },

    _getHours: function() {
      var hours = [];
      var initHour = this.props.format === 12 ? 1 : 0;
      for (var h = initHour; h < this.props.format; h++) {
        hours.push(h);
      }

      if (this.props.format === 12) {
        hours.push(12);
      }

      return hours;
    },

    _getMinutes: function() {
      var minutes = [];
      for (var m = 0; m < 60; m++) {
        minutes.push(m);
      }

      return minutes;
    },

    componentWillUpdate: function(nextProps) {
      var selectedHourNode = ReactDOM.findDOMNode(this.refs["hour-" + nextProps.selectedHour]);
      var selectedMinuteNode = ReactDOM.findDOMNode(this.refs["minute-" + nextProps.selectedMinute]);

      this._scrollToSelectedTime(selectedHourNode, selectedMinuteNode);
    },

    componentDidMount: function() {
      var selectedHourNode = ReactDOM.findDOMNode(this.refs["hour-" + this.props.selectedHour]);
      var selectedMinuteNode = ReactDOM.findDOMNode(this.refs["minute-" + this.props.selectedMinute]);

      this._scrollToSelectedTime(selectedHourNode, selectedMinuteNode);
    },

    _scrollToSelectedTime: function(selectedHour, selectedMinute) {
      var container = ReactDOM.findDOMNode(this);
      var containerHours = container.querySelector(".spinner-hours");
      var containerMinutes = container.querySelector(".spinner-minutes");
      var containerHeight = containerHours.clientHeight;
      var buttonHeight = selectedHour.clientHeight;

      var scrollHourYOffset = (selectedHour.offsetTop + buttonHeight / 2) - containerHeight / 2;
      var scrollMinuteYOffset = (selectedMinute.offsetTop + buttonHeight / 2) - containerHeight / 2;

      containerHours.scrollTop = scrollHourYOffset;
      containerMinutes.scrollTop = scrollMinuteYOffset;
    },

    render: function() {
      var hours = this._getHours();
      var minutes = this._getMinutes();
      return (
        <div className="time-spinner">
          <div className="spinner-hours">
            {
              hours.map(function(hour, index) {
                return (
                  <TimeSpinnerButton
                    handleClick={this.props.handleHourClick}
                    label={hour}
                    key={index}
                    ref={"hour-" + hour}
                    selected={hour === this.props.selectedHour} />
                );
              }, this)
            }
          </div>
          <div className="spinner-minutes">
            {
              minutes.map(function(minute, index) {
                return (
                  <TimeSpinnerButton
                    handleClick={this.props.handleMinuteClick}
                    label={minute}
                    key={index}
                    ref={"minute-" + minute}
                    selected={minute === this.props.selectedMinute} />
                );
              }, this)
            }
          </div>
        </div>
      );
    }
  });

  var TimeSpinnerButton = React.createClass({
    propTypes: {
      handleClick: React.PropTypes.func,
      label: React.PropTypes.number.isRequired,
      selected: React.PropTypes.bool.isRequired
    },

    handleClick: function(event) {
      this.props.handleClick && this.props.handleClick(event, this.props.label);
    },

    render: function() {
      var cssClasses = {
        "time-button": true,
        "selected": this.props.selected
      };
      return (
        <div className={classNames(cssClasses)} onClick={this.handleClick}>
          {
            this.props.label < 10 ?
              "0" + this.props.label :
              this.props.label
          }
        </div>
      );
    }
  });

  var AppBarView = React.createClass({
    statics: {
      // The width of each button displayed in the app bar
      APP_BAR_ICON: 56
    },

    propTypes: {
      children: React.PropTypes.node,
      currentRoute: React.PropTypes.string.isRequired,
      infoCallback: React.PropTypes.func,
      showInfoButton: React.PropTypes.bool,
      title: React.PropTypes.string.isRequired,
      style: React.PropTypes.object,
      zIndex: React.PropTypes.oneOf([1, 2, 3, 4, 5])
    },

    getDefaultProps: function() {
      return {
        showInfoButton: false,
        zIndex: 1
      };
    },

    componentWillMount: function() {
      if (this.props.children && this.props.currentRoute === "index") {
        // window.addEventListener("scroll", this.onScroll);
      }
    },

    componentWillUnMount: function() {
      if (this.props.children && this.props.currentRoute === "index") {
        // window.removeEventListener("scroll", this.onScroll);
      }
    },

    _getStyleProperty: function(property) {
      var style = window.getComputedStyle(ReactDOM.findDOMNode(this), null);
      return parseInt(style.getPropertyValue(property), 10);
    },

    onScroll: function(evt) {
      this._currentScrollY = window.scrollY;
      if (!this._lastScrollY) {
        this._lastScrollY = window.scrollY;
      }

      if (!this.ticking) {
        window.requestAnimationFrame(function() {
          var incY = this._lastScrollY - this._currentScrollY;
          var top = this._getStyleProperty("top") + incY;

          if (this._lastScrollY > this._currentScrollY) {
            top = top > 0 ? 0 : top;
          } else {
            top = top < -54 ? -54 : top;
          }
          ReactDOM.findDOMNode(this).style.top = top + "px";
          this._lastScrollY = this._currentScrollY;
          this.ticking = false;
        }.bind(this));
      }
      this.ticking = true;
    },

    goBack: function () {
      window.history.back();
    },

    _shouldRenderBackButton: function() {
      return this.props.currentRoute !== "index";
    },

    _getTitleWidth: function() {
      var width = window.innerWidth;
      if (this._shouldRenderBackButton()) {
        width -= this.constructor.APP_BAR_ICON;
      }

      if (this.props.showInfoButton) {
        width -= this.constructor.APP_BAR_ICON;
      }

      return {
        width: width + "px"
      };
    },

    render: function() {
      var containerClasses = {
        "material-app-bar-container": true,
        "back-icon-visible": this._shouldRenderBackButton()
      };

      containerClasses["zDepth" + this.props.zIndex] = true;

      return (
        <div className={classNames(containerClasses)}>
          <div className="material-app-bar">
            {
              this._shouldRenderBackButton() ?
                <RippleButton
                  extraCSSClasses={{ "borderless": true, "app-bar-icon": true }}
                  handleClick={this.goBack}>
                  <img src="img/material/arrow_back_white.svg" />
                </RippleButton> : null
            }
            <h1 style={this._getTitleWidth()}>{this.props.title}</h1>
            {
              this.props.showInfoButton ?
                <RippleButton
                  extraCSSClasses={{ "borderless": true, "app-bar-icon": true, "info-icon": true }}
                  handleClick={this.props.infoCallback}>
                  <img src="img/material/info.svg" />
                </RippleButton> : null
            }
          </div>
          { this.props.currentRoute === "index" ? this.props.children : null }
        </div>
      );
    }
  });

  var TabsView = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      onChange: React.PropTypes.func,
      selectedTab: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        selectedTab: 0
      };
    },

    getInitialState: function() {
      return {
        selectedTab: this.props.selectedTab
      };
    },

    getTabs: function() {
      const tabs = [];
      React.Children.forEach(this.props.children, function(tab) {
        if (React.isValidElement(tab)) {
          tabs.push(tab);
        }
      });

      return tabs;
    },

    handleTabClick: function(tab) {
      this.setState({
        selectedTab: tab
      });

      this.props.onChange && this.props.onChange(tab);
    },

    render: function() {
      const tabs = this.getTabs();
      const tabWidth = 100 / tabs.length;
      var indicatorStyle = {
        left: tabWidth * this.state.selectedTab + "%",
        width: tabWidth + "%"
      };

      return (
        <div className="material-tabs-container">
          {
            tabs.map(function(tab, index) {
              return React.cloneElement(tab, {
                handleTabClick: this.handleTabClick,
                key: index,
                selected: index === this.state.selectedTab,
                tabIndex: index,
                width: tabWidth
              });
            }, this)
          }
          <div className="material-tabs-indicator" style={indicatorStyle}></div>
        </div>
      );
    }
  });

  var TabView = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      handleTabClick: React.PropTypes.func,
      label: React.PropTypes.string,
      selected: React.PropTypes.bool,
      tabIndex: React.PropTypes.number,
      width: React.PropTypes.number
    },

    handleTabClick: function() {
      this.props.handleTabClick &&
        this.props.handleTabClick(this.props.tabIndex);
    },

    render: function() {
      var buttonStyle = {
        width: this.props.width + '%'
      };

      var extraClasses = {
        "material-tab": true,
        "selected": this.props.selected
      };

      return (
        <RippleButton
          extraCSSClasses={extraClasses}
          handleClick={this.handleTabClick}
          label={this.props.label}
          style={buttonStyle}>
          {this.props.children}
        </RippleButton>
      );
    }
  });

  var TabsContent = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      selectedTab: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        selectedTab: 0
      };
    },

    getTabsContent: function() {
      const tabsContent = [];
      React.Children.forEach(this.props.children, function(tabContent) {
        if (React.isValidElement(tabContent)) {
          tabsContent.push(tabContent);
        }
      });

      return tabsContent;
    },

    render: function() {
      const tabsContent = this.getTabsContent();
      return (
        <div className="material-tabs-content">
          {
            tabsContent.map(function(tabContent, index) {
              return React.cloneElement(tabContent, {
                key: index,
                selectedTab: this.props.selectedTab,
                tabIndex: index
              });
            }, this)
          }
        </div>
      );
    }
  });

  var TabContentView = React.createClass({
    propTypes: {
      children: React.PropTypes.node.isRequired,
      selectedTab: React.PropTypes.number,
      tabIndex: React.PropTypes.number
    },

    getInitialState: function() {
      return {
        toLeft: false,
        toRight: false
      };
    },

    componentWillReceiveProps: function(nextProps) {
      var selected = this.props.selectedTab === this.props.tabIndex;
      var willBeSelected = nextProps.selectedTab === nextProps.tabIndex;

      if (nextProps.selectedTab === this.props.selectedTab) {
        return;
      }
// TODO: simplify code below
      if (selected) {
        if (nextProps.selectedTab > this.props.selectedTab) {
          this.setState({
            toLeft: true,
            toRight: false,
            fromLeft: false,
            fromRight: false
          });
        } else {
          this.setState({
            toLeft: false,
            toRight: true,
            fromLeft: false,
            fromRight: false
          });
        }
      } else if (willBeSelected) {
        if (nextProps.selectedTab > this.props.selectedTab) {
          this.setState({
            toLeft: false,
            toRight: false,
            fromLeft: false,
            fromRight: true
          });
        } else {
          this.setState({
            toLeft: false,
            toRight: false,
            fromLeft: true,
            fromRight: false
          });
        }
      } else {
        this.setState({
          toLeft: false,
          toRight: false,
          fromLeft: false,
          fromRight: false
        });
      }
    },

    render: function() {
      var cssClasses = {
        "tab-content": true,
        "selected": this.props.selectedTab === this.props.tabIndex,
        "to-right": this.state.toRight,
        "to-left": this.state.toLeft,
        "from-right": this.state.fromRight,
        "from-left": this.state.fromLeft
      };

      // XXX trick to let the tab fits the whole screen
      var style = {
        height: (window.innerHeight - 70) + "px"
      };

      return (
        <div className={classNames(cssClasses)} style={style}>
          {this.props.children}
        </div>
      );
    }
  });

  var CardView = React.createClass({
    propTypes: {
      data: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func
    },

    render: function() {
      return (
        <div className="material-card">
          <div className="card-info-wrapper">
            <h1 className="card-title">{this.props.data.title}</h1>
            <p>
              {this.props.data.content}
            </p>
          </div>
          <div className="card-buttons">
            <RippleButton
              extraCSSClasses="borderless"
              handleClick={this.props.onClick}
              label="Aceptar" />
          </div>
        </div>
      );
    }
  });

  var DropdownView = React.createClass({
    statics: {
      CONTENT_MARGIN: 20
    },

    propTypes: {
      children: React.PropTypes.node.isRequired,
      extraCSSClass: React.PropTypes.string,
      label: React.PropTypes.string.isRequired,
      opened: React.PropTypes.bool
    },

    getDefaultProps: function() {
      return {
        opened: false
      };
    },

    getInitialState: function() {
      return {
        opened: this.props.opened
      };
    },

    toggleDropdow: function() {
      this._calculateContentHeight();
      this.setState({
        opened: !this.state.opened
      });
    },

    componentWillReceiveProps: function(nextProps) {
      if (nextProps.children !== this.props.children) {
        this._calculateContentHeight();
      }
    },

    componentDidMount: function() {
      this._calculateContentHeight();
    },

    _calculateContentHeight: function() {
      var height = 0;
      var container = ReactDOM.findDOMNode(this).querySelector(".dropdown-content");
      var self = this;
      Array.prototype.forEach.call(container.children, function(children) {
        if (children.tagName === "IMG") {
          children.addEventListener("load", function onLoad() {
            children.removeEventListener("load", onLoad);
            // Let's calculate again the height once the image has been loaded
            self._calculateContentHeight();
          });
        }
        height += children.clientHeight;
      });

      this.state.height = height + this.constructor.CONTENT_MARGIN;
    },

    render: function() {
      var btnExtraClasses = {
        "borderless": true,
        "dropdown-btn": true,
        "opened": this.state.opened
      };

      var contentClasses = {
        "dropdown-content": true
      };

      if (this.props.extraCSSClass) {
        contentClasses[this.props.extraCSSClass] = true;
      }

      var styleContent = {
        height: this.state.opened ? this.state.height + "px" : 0
      };

      return (
        <div className="material-dropdown">
          <RippleButton
            extraCSSClasses={btnExtraClasses}
            handleClick={this.toggleDropdow}
            label={this.props.label} />
          <div className={classNames(contentClasses)} style={styleContent}>
            {this.props.children}
          </div>
        </div>
      );
    }
  });

  var FloatActionButton = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      disabled: React.PropTypes.bool,
      extraCSSClasses: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ]),
      handleClick: React.PropTypes.func
    },

    getDefaultProps: function (){
      return {
        disabled: false
      };
    },

    render: function() {
      var cssClasses = {
        "material-fab": true
      };

      if (this.props.extraCSSClasses) {
        typeof this.props.extraCSSClasses === "object" ?
          _.extend(cssClasses, this.props.extraCSSClasses) :
          cssClasses[this.props.extraCSSClasses] = true;
      }

      return (
        <button
          className={classNames(cssClasses)}
          disabled={this.props.disabled}
          onClick={this.props.handleClick}>
          {this.props.children}
        </button>
      );
    }
  });

  var SnackbarView = React.createClass({
    statics: {
      CLOSE_DELAY: 3000
    },

    mixins: [
      StoreMixin("snackbarStore")
    ],

    getInitialState: function() {
      return this.getStore().getStoreState();
    },

    componentDidUpdate: function() {
      if (this.state.label) {
        ReactDOM.findDOMNode(this).classList.add("open");
        setTimeout(function() {
          // Let's reset the label and hide the snackbar
          this.getStore().setStoreState({
            label: ""
          });
        }.bind(this), this.constructor.CLOSE_DELAY);
      } else {
        ReactDOM.findDOMNode(this).classList.remove("open");
      }
    },

    render: function() {
      return (
        <div className="material-snackbar">
          {this.state.label}
        </div>
      );
    }
  });

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
      var currentChoice = ReactDOM.findDOMNode(this).querySelector(".choices .selected");

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
          <RippleButton
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

  return {
    AppBarView: AppBarView,
    CalendarView: CalendarView,
    CardView: CardView,
    ChoiceButton: ChoiceButton,
    ChoicesView: ChoicesView,
    DropdownView: DropdownView,
    FloatActionButton: FloatActionButton,
    Input: Input,
    LoaderView: LoaderView,
    RippleButton: RippleButton,
    SelectView: SelectView,
    SnackbarView: SnackbarView,
    TabContentView: TabContentView,
    TabsContent: TabsContent,
    TabView: TabView,
    TabsView: TabsView,
    TimePickerView: TimePickerView
  };
});
