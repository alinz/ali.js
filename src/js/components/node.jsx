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
    props,
    size            = new Vector2D();

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
    size.x = 100;
    size.y = 100;
  },
  update: function () {
    this.props.update();
  },
  render: function () {
    props = this.props;

    this.calculateSize();

    return (
      <g onMouseDown={this.startDragging}>
        <Rect x={props.position.x}
              y={props.position.y}
              width={size.x}
              height={size.y}/>
      </g>
    );
  }
});

module.exports = Node;
