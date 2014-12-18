"use strict";

var React = require("react"),

    //utils
    Vector2D = require("./../util/math/vector2d.js"),

    //mixins
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin = require("./../mixins/touch-util.js"),
    ZoomMixin = require("./../mixins/zoom.js"),
    DraggableMixin = require("./../mixins/draggable.js"),

    Rect = require("./rect.jsx"),

    //global variables
    transform = "";

React.initializeTouchEvents(true);

var Scene = React.createClass({
  mixins: [
    AnimationFrameMixin,
    TouchUtilMixin,
    ZoomMixin
  ],
  getDefaultProps: function () {
    return {
      scale: 1.0,
      position: new Vector2D(0, 0),
    };
  },
  getInitialState: function () {
    return {
      renderTrigger: 0
    };
  },
  componentWillMount: function () {
  },
  componentDidMount: function () {
    this.startZoom();
  },
  componentWillUnmount: function () {
    this.stopZoom();
  },
  update: function () {
    this.setStateAnimationFrame({
      renderTrigger: this.state.renderTrigger++
    });
  },
  render: function () {
    transform = "matrix(" + this.props.scale + ",0,0," + this.props.scale + "," + this.props.position.x + "," + this.props.position.y + ")";
    return (
      <svg>
        <g transform={transform}>
          <Rect width={100} height={100}/>
        </g>
      </svg>
    );
  }
});

module.exports = Scene;
