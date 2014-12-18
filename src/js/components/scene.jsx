"use strict";

var React = require("react"),

    //mixins
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin = require("./../mixins/touch-util.js"),
    EventEmitter = require("./../mixins/event-emitter.js");

var Scene = React.createClass({
  mixins: [
    AnimationFrameMixin,
    TouchUtilMixin,
    EventEmitter
  ],
  render: function () {
    return (
      <p>Hello World this is scene!</p>
    );
  }
});

module.exports = Scene;
