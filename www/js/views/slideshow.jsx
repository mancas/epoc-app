define([
  "build/materialViews",
  "build/epocViews",
  "utils/dateTime",
  "utils/stringsHelper",
  "utils/utilities",
  "_"
], function(materialViews, epocViews,
            DateTimeHelper, StringsHelper, utils, _) {
  "use strict";

  var SlideshowView = React.createClass({
    propTypes: {
      model: React.PropTypes.object.isRequired,
      onFinish: React.PropTypes.func,
      showPagination: React.PropTypes.bool,
      slides: React.PropTypes.array.isRequired
    },

    getDefaultProps: function() {
      return {
        showPagination: true
      };
    },

    next: function(modelKey, value) {
      var newState = {
        currentSlide: this.state.currentSlide + 1
      };

      if (typeof this.state.model[modelKey] !== "undefined" &&
        typeof value !== "undefined") {
        var cloneModel = {};
        for (var key in this.state.model) {
          if (key === modelKey) {
            cloneModel[key] = value;
          } else {
            cloneModel[key] = this.state.model[key];
          }
        }

        newState.model = cloneModel;
      }
      this.setState(newState);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
      // Prevents the component updates twice
      return nextState.currentSlide !== this.state.currentSlide;
    },

    componentWillUpdate: function(nextProps, nextState) {
      // Last slide so let's start preparing the database
      if (nextState.currentSlide === this.props.slides.length - 1) {
        this.props.onFinish && this.props.onFinish(nextState.model);
      }
    },

    getInitialState: function() {
      return {
        currentSlide: 0,
        model: this.props.model
      };
    },

    render: function() {
      return (
        <div className="slideshow">
          {
            this.props.slides.map(function(slideNode, index) {
              var ref = "slide-" + index;
              return (
                <Slide
                  currentSlide={this.state.currentSlide}
                  index={index}
                  key={index}
                  model={this.state.model}
                  nextSlide={this.next}
                  ref={ref}
                  slide={slideNode} />
              );
            }, this)
          }
          {
            this.props.showPagination ?
              <PaginationView
                currentPage={this.state.currentSlide}
                pages={this.props.slides.length - 1}
                ref="pagination"/> : null
          }
        </div>
      );
    }
  });

  var Slide = React.createClass({
    propTypes: {
      index: React.PropTypes.number.isRequired,
      currentSlide: React.PropTypes.number.isRequired,
      model: React.PropTypes.object.isRequired,
      nextSlide: React.PropTypes.func.isRequired,
      slide: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        isValid: true,
        showCalendar: false
      };
    },

    shouldComponentUpdate: function(newProps, newState) {
      if (this.props.index === this.props.currentSlide &&
        newProps.currentSlide === this.props.index + 1) {
        this.getDOMNode().classList.add("done");
        this.getDOMNode().classList.remove("current");
        return false;
      } else if (newProps.currentSlide === this.props.index) {
        this.getDOMNode().classList.add("current");
      }

      // Render if isValid state has changed
      if (this.state.isValid !== newState.isValid ||
        this.state.showCalendar !== newState.showCalendar) {
          return true;
      }

      // Render if model has changed and any of the strings has dependency
      // on the model
      return ((this.props.model !== newProps.model) && this._hasDependency());
    },

    _hasDependency: function() {
      var key = _.findKey(this.props.slide, "modelRequired");
      return key ? key : false;
    },

    isValid: function(isValid) {
      switch (this.props.slide.type) {
        case "input":
        case "choice":
        case "date":
          this.setState({
            isValid: isValid
          });
          break;
        default:
          return this.setState({
            isValid: true
          });
      }
    },

    _openCalendar: function() {
      this.setState({
        showCalendar: true
      });
    },

    _closeCalendar: function(date) {
      this.setState({
        selectedDate: date,
        showCalendar: false
      });
    },

    _onCalendarAcceptAction: function(date) {
      this.refs.slideInput.setInputValue(DateTimeHelper.format(date, { long: true }));
      this._closeCalendar(date);
    },

    _prepareString: function(string) {
      var result = "";
      if (typeof string === "object") {
        var params = string.params || [];
        if (string.modelRequired) {
          var key = string.modelRequired;
          var modelParam = {};
          modelParam[key] = this.props.model[key];
          params.push(modelParam);
        }

        result = StringsHelper.getString(string.id, params);
      }

      return result;
    },

    handleButtonClick: function(event, modelValue) {
      var modelName = this.props.slide.question && this.props.slide.question.modelName || undefined;

      switch (this.props.slide.type) {
        case "input":
          var input = this.getDOMNode().querySelector("input[name=\"" + modelName + "\"");
          if (!input) {
            throw new Error("Input not defined for model key: " + modelName);
          }

          modelValue = input.value;
          break;
        case "choice":
          var selectedChoice =
            this.getDOMNode().querySelector("input[name=\"" + modelName + "\"][type=\"radio\"]:checked");
          if (!selectedChoice) {
            throw new Error("Choice not defined for model key: " + modelName);
          }

          modelValue = selectedChoice.value;
          break;
        case "date":
          modelValue = this.state.selectedDate;
          break;
      }

      this.props.nextSlide(modelName, modelValue);
    },

    renderInputSlide: function() {
      var onFocus = this.props.slide.type === "date" ? this._openCalendar : null;
      return (
        <materialViews.Input
          inputName={this.props.slide.question.modelName}
          isValid={this.isValid}
          label={this.props.slide.question.field.label}
          maxValue={this.props.slide.question.field.maxValue}
          maxLength={this.props.slide.question.field.maxLength}
          minValue={this.props.slide.question.field.minValue}
          onFocus={onFocus}
          ref="slideInput"
          required={this.props.slide.question.field.required}
          type={this.props.slide.question.field.type} />
      );
    },

    renderDecisionSlide: function() {
      return (
        null
      );
    },

    renderChoiceSlide: function() {
      return (
        <epocViews.ChoicesView
          choiceName={this.props.slide.question.modelName}
          choices={this.props.slide.question.choices}
          hasValue={this.isValid}/>
      );
    },

    renderCalendar: function() {
      return (
        <materialViews.CalendarView
          handleAcceptAction={this._onCalendarAcceptAction}
          handleCancelAction={this._closeCalendar}
          showCalendar={this.state.showCalendar} />
      );
    },

    render: function() {
      var id = "slide-" + this.props.index;
      var slideContent = null;
      switch (this.props.slide.type) {
        case "input":
        case "date":
          slideContent = this.renderInputSlide();
          break;
        case "decision":
          slideContent = this.renderDecisionSlide();
          break;
        case "choice":
          slideContent = this.renderChoiceSlide();
          break;
        case "loader":
          slideContent = (
            <epocViews.LoaderView />
          );
        default:
          break;
      }

      var cssClasses = {
        "slide": true,
        "current": this.props.currentSlide === this.props.index
      };

      _.extend(cssClasses, this.props.slide.slideCSSClasses || {});

      var iconClasses = {
        "slide-icon": true,
        "hidden": !!this.props.slide.hideIcon
      };

      return (
        <section className={classNames(cssClasses)} id={id}>
          <div className="slide-content">
            <span className={classNames(iconClasses)}></span>
            <h1>{this._prepareString(this.props.slide.title)}</h1>
            <p>{this._prepareString(this.props.slide.text)}</p>
            {slideContent}
            {
              this.props.slide.buttons.map(function(button, index) {
                return (
                  <materialViews.RippleButton
                    disabled={!this.state.isValid}
                    extraCSSClasses={button.className}
                    fullWidth={button.fullWidth}
                    handleClick={this.handleButtonClick}
                    key={index}
                    label={this._prepareString(button.label)}
                    model={button.modelValue}/>
                );
              }, this)
            }
          </div>
          {this.renderCalendar()}
        </section>
      );
    }
  });

  var PaginationView = React.createClass({
    propTypes: {
      currentPage: React.PropTypes.number.isRequired,
      pages: React.PropTypes.number.isRequired
    },

    shouldComponentUpdate: function(newProps) {
      if (newProps.currentPage > this.props.pages - 1) {
        return true;
      }

      var activeBullet = this.getDOMNode().querySelector(".active");
      activeBullet.classList.remove("active");
      var newActiveBullet = this.refs["page-" + newProps.currentPage];
      if (!newActiveBullet) {
        return true;
      }
      newActiveBullet.getDOMNode().classList.add("active");

      // Avoid trigger render method unnecessarily
      return false;
    },

    _renderPages: function() {
      var bullets = [];
      for (var i = 0; i < this.props.pages; i++) {
        var cssClasses = classNames({
          "bullet": true,
          "active": this.props.currentPage === i
        });
        var ref = "page-" + i;
        bullets.push(<span className={cssClasses} key={i} ref={ref}></span>);
      }

      return bullets;
    },

    render: function() {
      if (this.props.currentPage > this.props.pages - 1) {
        return null;
      }

      return (
        <div className="pagination">
          {this._renderPages()}
        </div>
      );
    }
  });

  return {
    Slide: Slide,
    SlideshowView: SlideshowView
  };
});
