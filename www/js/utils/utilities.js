define([], function() {
  "use strict";

  function getClosest(el, tag) {
    // this is necessary since nodeName is always in upper case
    tag = tag.toUpperCase();
    do {
      if (el.nodeName === tag) {
        // tag name is found! let's return it. :)
        return el;
      }
    } while (el.previousElementSibling ? el = el.previousElementSibling : el = el.parentNode);
    // not found :(
    return null;
  }

  return {
    closest: getClosest
  };
});
