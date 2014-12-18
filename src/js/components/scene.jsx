"use strict";

var React = require("react"),

    //mixins
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin = require("./../mixins/touch-util.js"),
    EventEmitter = require("./../mixins/event-emitter.js"),

    Rect = require("./rect.jsx");

var Scene = React.createClass({
  mixins: [
    AnimationFrameMixin,
    TouchUtilMixin,
    EventEmitter
  ],
  getInitialState: function () {
    return {
      renderTrigger: 0
    };
  },
  componentWillMount: function () {
  },
  componentDidMount: function () {
  },
  update: function () {
    this.setStateAnimationFrame({
      renderTrigger: this.state.renderTrigger++
    });
  },
  render: function () {
    return (
      <svg>
        <Rect width={100} height={100}/>
      </svg>
    );
  }
});

module.exports = Scene;
