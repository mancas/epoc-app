define([
  "build/materialViews",
  "build/epocViews",
  "slideshowData",
  "utils/dispatcher",
  "utils/dateTime",
  "utils/stringsHelper",
  "utils/databaseManager",
  "utils/actions",
  "utils/utilities",
  "_"
], function(materialViews, epocViews, slideshowData, Dispatcher,
            DateTimeHelper, StringsHelper, dbManager, actions, utils, _) {
  "use strict";

  var SlideshowView = React.createClass({
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

    componentWillUpdate: function(nextProps, nextState) {
      // Last slide so let's start preparing the database
      if (nextState.currentSlide === slideshowData.slides.length - 1) {
        var model = utils.prepareModel(nextState.model);
        dbManager.openDatabase(function(){
          dbManager.insert("User", model, function(result) {
            console.info("INSERT RESULT", result);
            dbManager.select("User", null, null, function(result) {
              console.info("SELECT result", result.rows.item(0));
            });
            localStorage.setItem("introSeen", "true");
            this.props.dispatcher.dispatch(new actions.UpdateUserData(model));
          }.bind(this));
        }.bind(this), function(err) {
          console.error(err);
        });

        // For testing purpose
        localStorage.setItem("introSeen", "true");
        this.props.dispatcher.dispatch(new actions.UpdateUserData(model));
      }
    },

    getInitialState: function() {
      return {
        currentSlide: 0,
        model: slideshowData.model
      };
    },

    render: function() {
      dbManager.openDatabase();
      return (
        <div className="slideshow">
          {
            slideshowData.slides.map(function(slideNode, index) {
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
          <PaginationView
            currentPage={this.state.currentSlide}
            pages={slideshowData.slides.length}
            ref="pagination"/>
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
          maxLength={this.props.slide.question.field.maxLength}
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
          choices={this.props.slide.question.choices} />
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

      var iconClasses = {
        "slide-icon": true,
        "hidden": this.props.slide.type === "loader"
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
        bullets.push(<span className={cssClasses} key={i} ref={ref}></span>);
      }

      return bullets;
    },

    render: function() {
      return (
        <div className="pagination">
          {this._renderPages()}
        </div>
      );
    }
  });

  return SlideshowView;
});
