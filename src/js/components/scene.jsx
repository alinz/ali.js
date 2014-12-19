"use strict";

var React               = require("react"),

    //utils
    Vector2D            = require("./../util/math/vector2d.js"),

    //mixins
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin      = require("./../mixins/touch-util.js"),
    ZoomMixin           = require("./../mixins/zoom.js"),
    EventEmitterMixin   = require("./../mixins/event-emitter.js"),
    DraggableMixin      = require("./../mixins/draggable.js"),

    //components
    Node                = require("./node.jsx"),

    //global variables
    transform           = "";

React.initializeTouchEvents(true);

var Scene = React.createClass({
  mixins: [
    AnimationFrameMixin,
    TouchUtilMixin,
    EventEmitterMixin,
    ZoomMixin,
    DraggableMixin
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
    this.props.nodes = [
      { position: new Vector2D(), label: "node1" },
      { position: new Vector2D(), label: "node2" }
    ];
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

    var nodes = this.props.nodes.map(function (node, index) {
      return (
        <Node key={index}
              scale={this.props.scale}
              position={node.position}
              label={node.label}
              update={this.update}/>
      );
    }, this);

    return (
      <svg onMouseDown={this.startDragging}>
        <g transform={transform}>
          {nodes}
        </g>
      </svg>
    );
  }
});

module.exports = Scene;
