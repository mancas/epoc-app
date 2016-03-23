var ep = ep || {};

ep.app = (function() {
  "use strict";

  var Link = ReactRouter.Link;
  var Route = ReactRouter.Route;
  var Router = ReactRouter.Router;
  var materialViews = ep.materialViews;

  var Slideshow = React.createClass({displayName: "Slideshow",
    propTypes: {
      data: React.PropTypes.array.isRequired
    },

    next: function() {
      var currentSlide = document.querySelector('.slide.current');
      var index = $scope.slides.indexOf(currentSlide);
      if (!$scope.slides[index + 1]) {
        return;
      }

      currentSlide.classList.add('done');
      currentSlide.classList.remove('current');
      $scope.slides[++index].classList.add('current');
    },

    render: function() {
      return (
        React.createElement("div", {className: "slideshow"}, 
          React.createElement(Slides, {data: this.props.data})
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
                 indexClass: slideNode.id, 
                 text: slideNode.text, 
                 title: slideNode.title})
        );
      });

      return {slideNodes};
    }
  });

  var Slide = React.createClass({displayName: "Slide",
    propTypes: {
      index: React.PropTypes.number.isRequired,
      indexClass: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired
    },

    render: function() {

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