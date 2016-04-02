define([
  "build/materialViews",
  "build/epocViews",
  "slideshowData",
  "utils/dispatcher",
  "utils/dateTime",
  "utils/stringsHelper"
], function(materialViews, epocViews, slideshowData, Dispatcher, DateTimeHelper, StringsHelper) {
  "use strict";

  var SlideshowView = React.createClass({displayName: "SlideshowView",
    propTypes: {
      dispatcher: React.PropTypes.instanceOf(Dispatcher).isRequired
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

    getInitialState: function() {
      return {
        currentSlide: 7,
        model: slideshowData.model
      };
    },

    render: function() {
      return (
        React.createElement("div", {className: "slideshow"}, 
          
            slideshowData.slides.map(function(slideNode, index) {
              var ref = "slide-" + index;
              return (
                React.createElement(Slide, {
                  currentSlide: this.state.currentSlide, 
                  index: index, 
                  key: index, 
                  model: this.state.model, 
                  nextSlide: this.next, 
                  ref: ref, 
                  slide: slideNode})
              );
            }, this), 
          
          React.createElement(PaginationView, {
            currentPage: this.state.currentSlide, 
            pages: slideshowData.slides.length, 
            ref: "pagination"})
        )
      );
    }
  });

  var Slide = React.createClass({displayName: "Slide",
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
      return this.props.model !== newProps.model && this._hasDependency();
    },

    _hasDependency: function() {
      return _.findKey(this.props.slide, "modelRequired");
    },

    isValid: function(isValid) {
      switch (this.props.slide.type) {
        case "input":
        case "choice":
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
          if (this.props.slide.question.field.type === "date") {
            modelValue = this.state.selectedDate;
          } else {
            var input = this.getDOMNode().querySelector("input[name=\"" + modelName + "\"");
            if (!input) {
              throw new Error("Input not defined for model key: " + modelName);
            }

            modelValue = input.value;
          }
          break;
        case "choice":
          var selectedChoice =
            this.getDOMNode().querySelector("input[name=\"" + modelName + "\"][type=\"radio\"]:checked");
          if (!selectedChoice) {
            throw new Error("Choice not defined for model key: " + modelName);
          }

          modelValue = selectedChoice.value;
          break;
      }

      this.props.nextSlide(modelName, modelValue);
    },

    renderInputSlide: function() {
      var onFocus = this.props.slide.question.field.type === "date" ?
        this._openCalendar : null;
      return (
        React.createElement(materialViews.Input, {
          ref: "slideInput", 
          inputName: this.props.slide.question.modelName, 
          isValid: this.isValid, 
          label: this.props.slide.question.field.label, 
          maxLength: this.props.slide.question.field.maxLength, 
          onFocus: onFocus, 
          required: this.props.slide.question.field.required, 
          type: this.props.slide.question.field.type})
      );
    },

    renderDecisionSlide: function() {
      return (
        null
      );
    },

    renderChoiceSlide: function() {
      return (
        React.createElement(epocViews.ChoicesView, {
          choiceName: this.props.slide.question.modelName, 
          choices: this.props.slide.question.choices})
      );
    },

    renderCalendar: function() {
      return (
        React.createElement(materialViews.CalendarView, {
          handleAcceptAction: this._onCalendarAcceptAction, 
          handleCancelAction: this._closeCalendar, 
          showCalendar: this.state.showCalendar})
      );
    },

    render: function() {
      var id = "slide-" + this.props.index;
      var slideContent = null;
      switch (this.props.slide.type) {
        case "input":
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
            React.createElement(materialViews.LoaderView, null)
          );
        default:
          break;
      }

      var cssClasses = {
        "slide": true,
        "current": this.props.currentSlide === this.props.index
      };

      return (
        React.createElement("section", {className: classNames(cssClasses), id: id}, 
          React.createElement("div", {className: "slide-content"}, 
            React.createElement("span", {className: "slide-icon"}), 
            React.createElement("h1", null, this._prepareString(this.props.slide.title)), 
            React.createElement("p", null, this._prepareString(this.props.slide.text)), 
            slideContent, 
            
              this.props.slide.buttons.map(function(button, index) {
                return (
                  React.createElement(materialViews.RippleButton, {
                    disabled: !this.state.isValid, 
                    extraCSSClass: button.className, 
                    fullWidth: button.fullWidth, 
                    handleClick: this.handleButtonClick, 
                    key: index, 
                    label: this._prepareString(button.label), 
                    model: button.modelValue})
                );
              }, this)
            
          ), 
          this.renderCalendar()
        )
      );
    }
  });

  var PaginationView = React.createClass({displayName: "PaginationView",
    propTypes: {
      currentPage: React.PropTypes.number.isRequired,
      pages: React.PropTypes.number.isRequired
    },

    shouldComponentUpdate: function(newProps) {
      var activeBullet = this.getDOMNode().querySelector(".active");
      activeBullet.classList.remove("active");
      var newActiveBullet = this.refs["page-" + newProps.currentPage];
      if (!newActiveBullet) {
        return false;
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
        bullets.push(React.createElement("span", {className: cssClasses, key: i, ref: ref}));
      }

      return bullets;
    },

    render: function() {
      return (
        React.createElement("div", {className: "pagination"}, 
          this._renderPages()
        )
      );
    }
  });

  return SlideshowView;
});
