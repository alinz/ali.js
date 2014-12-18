"use strict";

module.exports = {
  on: function (event, func) {
    this.getDOMNode().addEventListener(event, func);
  },
  off: function (event, func) {
    this.getDOMNode().removeEventListener(event, func);
  },
  trigger: function (event, data, bubbles) {
    bubbles = bubbles || true;
    var eventObject = new CustomEvent(event, {
      detail: data,
      bubbles: bubbles
    });
    this.getDOMNode().dispatchEvent(eventObject);
  }
};
