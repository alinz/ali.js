/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React           = require("react"),

    //components
    Rect            = require("./rect.jsx"),
    Label           = require("./label.jsx"),

    //util
    Vector2D        = require("./../util/math/vector2d.js"),

    //mixins
    DraggableMixin  = require("./../mixins/draggable.js"),
    TouchUtilMixin  = require("./../mixins/touch-util.js"),

    //globals
    props;

var Node = React.createClass({
  mixins: [
    DraggableMixin,
    TouchUtilMixin
  ],
  propTypes: {
    scale: React.PropTypes.number.isRequired,
    position: React.PropTypes.instanceOf(Vector2D),
    label: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired
  },
  calculateSize: function () {
    props = this.props;

    if (!(this.props.size instanceof Vector2D)) {
      props.size = new Vector2D(100, 100);
      props.centerPosition = new Vector2D();
    }

    props.centerPosition.x = props.position.x + props.size.x / 2;
    props.centerPosition.y = props.position.y + props.size.y / 2;
  },
  getInitialState: function () {
      console.log("first");
      return {};
  },
  update: function () {
    this.props.update();
  },
  componentWillMount: function () {
    this.calculateSize();
  },
  shouldComponentUpdate: function () {
    this.calculateSize();
    return true;
  },
  render: function () {
    this.calculateSize();

    props = this.props;

    return (
      <g onMouseDown={this.startDragging}>
        <Rect x={props.position.x}
              y={props.position.y}
              width={props.size.x}
              height={props.size.y}/>
      </g>
    );
  }
});

module.exports = Node;
