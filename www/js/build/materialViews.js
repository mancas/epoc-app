define(["utils/dateTime", "utils/utilities"], function(DateTimeHelper, utils) {
  "use strict";

  var RippleButton = React.createClass({displayName: "RippleButton",
    propTypes: {
      children: React.PropTypes.node,
      disabled: React.PropTypes.bool,
      extraCSSClass: React.PropTypes.string,
      fullWidth: React.PropTypes.bool,
      handleClick: React.PropTypes.func,
      label: React.PropTypes.string.isRequired
    },

    rippleElement: null,
    diagonal: null,

    componentDidMount: function() {
      this.rippleElement = this.getDOMNode().querySelector(".ripple-effect");
      this.getDOMNode().addEventListener("touchstart", this.onTouchStart);
    },

    onTouchStart: function(event) {
      var elementBoundingClientRect = this.getDOMNode().getBoundingClientRect();
      var x, y;
      // Stop the previous animation in case of a
      // quick double click
      this.rippleElement.classList.remove('animate');

      // If it's the first time the user click the button,
      // width and height parameters must be set
      if (!this.rippleElement.clientHeight ||
        !this.rippleElement.clientWidth) {
        this.diagonal =
          Math.max(elementBoundingClientRect.height,
            elementBoundingClientRect.width);

        this.rippleElement.style.height = this.diagonal + 'px';
        this.rippleElement.style.width = this.diagonal + 'px';
      }

      x = event.touches[0].clientX -
        elementBoundingClientRect.left - this.diagonal/2;
      y = event.touches[0].clientY -
        elementBoundingClientRect.top - this.diagonal/2;

      this.rippleElement.style.top = y + 'px';
      this.rippleElement.style.left = x + 'px';

      this.rippleElement.classList.add('animate');
    },

    render: function() {
      var cssClasses = {
        "material-button": true,
        "btn-full-width": this.props.fullWidth
      };

      if (this.props.extraCSSClass) {
        cssClasses[this.props.extraCSSClass] = true;
      }

      return (
        React.createElement("button", {className: classNames(cssClasses), onClick: this.props.handleClick, disabled: this.props.disabled}, 
          React.createElement("span", {className: "ripple-effect"}), 
          this.props.children, 
          this.props.label
        )
      );
    }
  });

  var Input = React.createClass({displayName: "Input",
    propTypes: {
      inputName: React.PropTypes.string.isRequired,
      isValid: React.PropTypes.func,
      label: React.PropTypes.string.isRequired,
      maxLength: React.PropTypes.number,
      onFocus: React.PropTypes.func,
      required: React.PropTypes.bool
    },

    getInitialState: function () {
      return {
        invalid: false,
        touched: false,
        focused: false,
        hasValue: false
      }
    },

    componentDidMount: function() {
      var input = this.getDOMNode().querySelector("input");
      input.addEventListener("input", this.renderCharCount);
      input.addEventListener("keyup", this.renderCharCount);
      input.addEventListener("focus", this.onFocus);
      input.addEventListener("blur", this.onBlur);

      // Render char counter if needed at the initialize
      this.renderCharCount();
      this.validateInput();
    },

    componentWillUnmount: function() {
      var input = this.getDOMNode().querySelector("input");
      input.removeEventListener("input", this.renderCharCount);
      input.removeEventListener("keyup", this.renderCharCount);
      input.removeEventListener("focus", this.onBlur);
      input.removeEventListener("blur", this.onBlur);
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
      var input = this.getDOMNode().querySelector("input");
      input.value = value;
      this.validateInput();
    },

    renderCharCount: function() {
      var input = this.getDOMNode().querySelector("input");
      var charCounterElement = this.getDOMNode().querySelector(".material-char-counter");
      if (charCounterElement) {
        charCounterElement.textContent = String(input.value || '').length + '/' + this.props.maxLength;
      }
      this.validateInput();
    },

    renderMaxLengthView: function() {
      return (
        React.createElement("div", {className: "material-char-counter"})
      );
    },

    validateInput: function () {
      var input = this.getDOMNode().querySelector("input");
      var hasValue = input.value.length !== 0;
      var valid = true;

      if (input.required && !hasValue) {
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
        React.createElement("div", {className: classes}, 
          React.createElement("label", null, this.props.label), 
          React.createElement("input", {className: "form-control", required: this.props.required ? true : false, name: "{this.props.inputName}", maxLength: this.props.maxLength}), 
          this.props.maxLength ? this.renderMaxLengthView() : null
        )
      );
    }
  });

  var CalendarView = React.createClass({displayName: "CalendarView",
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
          this.getDOMNode().classList.add("material-calendar-display");
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
        React.createElement("div", {className: "calendar-content"}, 
          React.createElement(CalendarYearsView, {
            handleYearClick: this.handleYearClick, 
            minDate: this.props.minDate, 
            maxDate: this.props.maxDate, 
            selectedDate: this.state.selectedDate})
        )
      );
    },

    renderMonthView: function () {
      return (
        React.createElement("div", {className: "calendar-content"}, 
          React.createElement(CalendarNavigation, {
            handleMonthChange: this.handleMonthChange, 
            selectedDate: this.state.selectedDate}), 
          React.createElement(CalendarHeaderView, null), 
          React.createElement(CalendarDaysView, {
            handleClick: this.handleDayClick, 
            selectedDate: this.state.selectedDate})
        )
      );
    },

    render: function() {
      if (!this.state.showCalendar) {
        return null;
      }

      return (
        React.createElement("div", {className: "material-calendar-wrapper"}, 
          React.createElement("div", {className: "overlay"}), 
          React.createElement("div", {className: "material-calendar"}, 
            React.createElement(CalendarDateDisplay, {
              handleDateClick: this.toggleYearView, 
              selectedDate: this.state.selectedDate, 
              yearViewActive: this.state.yearViewActive}), 
              
                this.state.yearViewActive ?
                  this.renderYearView() : this.renderMonthView(), 
              
            React.createElement(CalendarButtons, {
              handleCancelAction: this.dismissCalendar, 
              handleAcceptAction: this.handleAcceptAction})
          )
        )
      );
    }
  });

  var CalendarDateDisplay = React.createClass({displayName: "CalendarDateDisplay",
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
        React.createElement("div", {className: "material-calendar-header"}, 
          React.createElement("span", {className: classNames(yearCSS), "data-view": "year", onClick: this.handleClick}, this.props.selectedDate.getFullYear()), 
          React.createElement("span", {className: classNames(dateCSS), "data-view": "month", onClick: this.handleClick}, DateTimeHelper.format(this.props.selectedDate))
        )
      );
    }
  });

  var CalendarNavigation = React.createClass({displayName: "CalendarNavigation",
    propTypes: {
      handleMonthChange: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired
    },

    handlePrev: function(event) {
      var target = this.refs["navigation-prev"];
      this._animateNode(target.getDOMNode());

      this.props.handleMonthChange && this.props.handleMonthChange(event, -1);
    },

    handleNext: function(event) {
      event.preventDefault();
      var target = this.refs["navigation-next"];
      this._animateNode(target.getDOMNode());
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
        React.createElement("div", {className: "calendar-navigation"}, 
          React.createElement("div", {className: "navigation-left", ref: "navigation-prev", onClick: this.handlePrev}, 
            React.createElement("span", {className: "chevron-left"})
          ), 
          React.createElement("span", null, DateTimeHelper.formatMonth(this.props.selectedDate)), 
          React.createElement("div", {className: "navigation-right", ref: "navigation-next", onClick: this.handleNext}, 
            React.createElement("span", {className: "chevron-right"})
          )
        )
      );
    }
  });

  var CalendarHeaderView = React.createClass({displayName: "CalendarHeaderView",
    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      var days = DateTimeHelper.dayAbbreviations;
      return (
        React.createElement("ul", {className: "calendar-days-header"}, 
          
            days.map(function(day, index) {
              return (
                React.createElement("li", {key: index}, day)
              );
            })
          
        )
      );
    }
  });

  var CalendarDaysView = React.createClass({displayName: "CalendarDaysView",
    propTypes: {
      handleClick: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired
    },

    render: function() {
      var monthWeeks = DateTimeHelper.getWeekArray(this.props.selectedDate);
      return (
        React.createElement("div", {className: "calendar-days"}, 
          
            monthWeeks.map(function(week, index) {
              return (
                React.createElement(CalendarWeekView, {
                  handleClick: this.props.handleClick, 
                  key: index, 
                  selectedDate: this.props.selectedDate, 
                  week: week})
              );
            }, this)
          
        )
      );
    }
  });

  var CalendarWeekView = React.createClass({displayName: "CalendarWeekView",
    propTypes: {
      handleClick: React.PropTypes.func,
      selectedDate: React.PropTypes.object.isRequired,
      week: React.PropTypes.object.isRequired
    },

    render: function() {
      return (
        React.createElement("div", {className: "calendar-week"}, 
          
            this.props.week.map(function(day, index) {
              return (
                React.createElement(CalendarDayButton, {
                  handleClick: this.props.handleClick, 
                  key: index, 
                  day: day, 
                  selectedDate: this.props.selectedDate})
              );
            }, this)
          
        )
      );
    }
  });

  var CalendarDayButton = React.createClass({displayName: "CalendarDayButton",
    propTypes: {
      day: React.PropTypes.object.isRequired,
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
        React.createElement("div", {className: classNames(cssClasses), onClick: this.handleDayClick}, 
          this.props.day ? React.createElement("span", null, this.props.day.getDate()) : null
        )
      );
    }
  });

  var CalendarYearsView = React.createClass({displayName: "CalendarYearsView",
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
        var oldYearBtn = this.refs[oldYearRef].getDOMNode();
        var newYearBtn = this.refs[newYearRef].getDOMNode();
        oldYearBtn.classList.remove("selected-year");
        newYearBtn.classList.add("selected-year");

        this._scrollToSelectedYear(newYearBtn);
      }

      return false;
    },

    componentDidMount: function() {
      var yearRef = "year-" + this.props.selectedDate.getFullYear();
      var yearBtn = this.refs[yearRef].getDOMNode();
      yearBtn.classList.add("selected-year");

      this._scrollToSelectedYear(yearBtn);
    },

    _scrollToSelectedYear: function(selectedYearNode) {
      var container = this.getDOMNode();
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
          React.createElement(CalendarYearButton, {
            handleYearClick: this.props.handleYearClick, 
            key: year - minYear, 
            ref: ref, 
            year: year})
        );

        years.push(yearButton);
      }

      return years;
    },

    render: function() {
      return (
        React.createElement("div", {className: "calendar-years"}, 
          this.getYearsList()
        )
      );
    }
  });

  var CalendarYearButton = React.createClass({displayName: "CalendarYearButton",
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
        React.createElement("div", {className: classNames(cssClasses), onClick: this.handleClick}, 
          this.props.year
        )
      );
    }
  });

  var CalendarButtons = React.createClass({displayName: "CalendarButtons",
    propTypes: {
      handleCancelAction: React.PropTypes.func.isRequired,
      handleAcceptAction: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        React.createElement("div", {className: "calendar-buttons"}, 
          React.createElement(RippleButton, {
            extraCSSClass: "borderless", 
            handleClick: this.props.handleCancelAction, 
            label: "Cancelar"}), 
          React.createElement(RippleButton, {
            extraCSSClass: "borderless", 
            handleClick: this.props.handleAcceptAction, 
            label: "Aceptar"})
        )
      );
    }
  });

  return {
    CalendarView: CalendarView,
    Input: Input,
    RippleButton: RippleButton
  };
});
