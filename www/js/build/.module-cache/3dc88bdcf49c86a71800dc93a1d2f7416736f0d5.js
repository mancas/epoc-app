var ep = ep || {};

ep.app = (function() {
  "use strict";

  var Link = ReactRouter.Link;
  var Route = ReactRouter.Route;
  var Router = ReactRouter.Router;
  var materialViews = ep.materialViews;
  var slideshowData = ep.slideshowData;

  var Slideshow = React.createClass({displayName: "Slideshow",
    next: function() {
      /*var currentSlide = document.querySelector('.slide.current');
      var index = $scope.slides.indexOf(currentSlide);
      if (!$scope.slides[index + 1]) {
        return;
      }

      currentSlide.classList.add('done');
      currentSlide.classList.remove('current');
      $scope.slides[++index].classList.add('current');*/
    },

    render: function() {
      return (
        React.createElement("div", {className: "slideshow"}, 
          React.createElement(Slides, {data: slideshowData})
        )
      );
    }
  });

  var Slides = React.createClass({displayName: "Slides",
    propTypes: {
      data: React.PropTypes.array.isRequired
    },

    render: function() {
      var slidesNodes = this.props.data.map(function(slideNode, index) {
        return (
          React.createElement(Slide, {index: index, 
                 slide: slideNode})
        );
      });

      return {slidesNodes};
    }
  });

  var Slide = React.createClass({displayName: "Slide",
    propTypes: {
      index: React.PropTypes.number.isRequired,
      slide: React.PropTypes.object.isRequired
    },

    renderInputSlide: function() {
      return (
        null
      );
    },

    renderDecisionSlide: function() {
      return (
        null
      );
    },

    renderChoiceSlide: function() {
      return (
        null
      );
    },

    render: function() {
      var id = "slide-" + this.props.index;
      var slideContent = null;
      switch(this.props.slide.type) {
        case "input":
          slideContent = this.renderInputSlide();
          break;
        case "decision":
          slideContent = this.renderDecisionSlide();
          break;
        case "choice":
          slideContent = this.renderChoiceSlide();
          break;
        default:
          break;
      }

      return (
        React.createElement("section", {id: id, className: "slide"}, 
          React.createElement("div", {class: "slide-content"}, 
            React.createElement("span", {class: "slide-icon"}), 
            React.createElement("h1", null, this.props.slide.title), 
            React.createElement("p", null, this.props.slide.text), 
            slideContent
          )
        )
      );
    }
  });

  var Header = React.createClass({displayName: "Header",
    render: function() {
      return React.createElement("header", null, "I'm a header");
    }
  });

  var App = React.createClass({displayName: "App",
    render: function() {
      return (
        React.createElement("div", {className: "app"}, 
          React.createElement(Header, null), 

          React.createElement(Link, {to: 'about'}, "Go to about page"), 

          React.createElement("div", {className: "page"}, 
            this.props.children
          )
        )
      );
    }
  });

  var AboutPage = React.createClass({displayName: "AboutPage",
    render: function() {
      return (
        React.createElement("div", {className: "about"}, 
          "About page", 
          React.createElement(materialViews.RippleButton, {label: "Continue"}), 
          React.createElement(materialViews.Input, {label: "Name", maxLength: 30, required: true})
        )
      );
    }
  });

  React.render((
    React.createElement(Router, null, 
      React.createElement(Route, {path: "/", component: App}, 
        React.createElement(Route, {path: "about", component: AboutPage}), 
        React.createElement(Route, {path: "*", component: AboutPage})
      )
    )
  ), document.querySelector('#main'));

  return {
    App: App
  }
})();