define(["utils/dateTime", "utils/utilities"], function(DateTimeHelper, utils) {
  "use strict";

  var RippleButton = React.createClass({
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
        React.PropTypes.number
      ]),
      style: React.PropTypes.object
    },

    getDefaultProps: function() {
      return {
        disabled: false,
        fullWidth: false
      };
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
      inputName: React.PropTypes.string.isRequired,
      isValid: React.PropTypes.func,
      label: React.PropTypes.string.isRequired,
      maxLength: React.PropTypes.number,
      onFocus: React.PropTypes.func,
      required: React.PropTypes.bool,
      type: React.PropTypes.string
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
        hasValue: false
      }
    },

    componentDidMount: function() {
      if (this.props.type === "date") {
        return;
      }

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
      var input = this.getDOMNode().querySelector("div.form-control");
      var attr = "value";
      if (this.props.type === "date") {
        attr = "textContent";
      }

      input[attr] = value;
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
        <div className="material-char-counter"></div>
      );
    },

    validateInput: function () {
      var input = this.getDOMNode().querySelector(".form-control");
      var attr = this.props.type === "date" ? "textContent" : "value";
      var hasValue = input[attr].length !== 0;
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
        <div className={classes}>
          <label>{this.props.label}</label>
          {
            this.props.type === "date" ?
              <div
                className="form-control"
                onClick={this.props.onFocus}
                required={this.props.required ? true : false}></div> :
              <input className="form-control"
                     maxLength={this.props.maxLength}
                     name={this.props.inputName}
                     onBlur={this.onBlur}
                     onFocus={this.onFocus}
                     onInput={this.renderCharCount}
                     onKeyUp={this.renderCharCount}
                     required={this.props.required ? true : false}
                     type={this.props.type === "date" ? "text" : this.props.type} />
          }
          {this.props.maxLength ? this.renderMaxLengthView() : null}
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
            <CalendarButtons
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
      week: React.PropTypes.object.isRequired
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

  var CalendarButtons = React.createClass({
    propTypes: {
      handleCancelAction: React.PropTypes.func.isRequired,
      handleAcceptAction: React.PropTypes.func.isRequired
    },

    shouldComponentUpdate: function() {
      return false;
    },

    render: function() {
      return (
        <div className="calendar-buttons">
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

  var AppBarView = React.createClass({
    propTypes: {
      children: React.PropTypes.node,
      title: React.PropTypes.string.isRequired,
      style: React.PropTypes.object,
      zIndex: React.PropTypes.oneOf([1, 2, 3, 4, 5])
    },

    getDefaultProps: function() {
      return {
        zIndex: 1
      };
    },

    render: function() {
      var containerClasses = {
        "material-app-bar-container": true
      };

      containerClasses["zDepth" + this.props.zIndex] = true;

      return (
        <div className={classNames(containerClasses)}>
          <div className="material-app-bar">
            <h1>{this.props.title}</h1>
          </div>
          {this.props.children}
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

    getInitialState: function() {
      return {
        selectedTab: this.props.selectedTab
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
                selected: index === this.state.selectedTab,
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
      selected: React.PropTypes.bool,
      tabIndex: React.PropTypes.number
    },

    getDefaultProps: function() {
      return {
        selected: false
      };
    },

    render: function() {
      var cssClasses = {
        "tab-content": true,
        "selected": this.props.selected
      };

      return (
        <div className={classNames(cssClasses)}>
          {this.props.children}
        </div>
      );
    }
  });

  var CardView = React.createClass({
    propTypes: {

    },

    render: function() {
      return (
        <div className="material-card">
          <div className="card-info-wrapper">
            <h1 className="card-title">Bienvenido Username</h1>
            <p>
              Usando estas tarjetas te iremos informando de aquellas cosas que sean importantes para ti.
            </p>
          </div>
          <div className="card-buttons">
            <RippleButton
              extraCSSClasses="borderless"
              label="Aceptar" />
            <RippleButton
              extraCSSClasses="borderless"
              label="Cancelar" />
          </div>
        </div>
      );
    }
  });

  return {
    AppBarView: AppBarView,
    CalendarView: CalendarView,
    CardView: CardView,
    Input: Input,
    RippleButton: RippleButton,
    TabContentView: TabContentView,
    TabsContent: TabsContent,
    TabView: TabView,
    TabsView: TabsView
  };
});
