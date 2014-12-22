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
    objRef;

var Node = React.createClass({
  mixins: [
    DraggableMixin,
    TouchUtilMixin
  ],
  propTypes: {
    scale: React.PropTypes.number.isRequired,
    label: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired,
    objRef: React.PropTypes.any.isRequired
  },
  calculateSize: function () {
    objRef = this.props.objRef;

    if (!(objRef.size instanceof Vector2D)) {
      objRef.size = new Vector2D(100, 100);
    }

    if (!(objRef.centerPosition instanceof Vector2D)) {
      objRef.centerPosition = new Vector2D();
    }

    objRef.centerPosition.x = objRef.position.x + objRef.size.x / 2;
    objRef.centerPosition.y = objRef.position.y + objRef.size.y / 2;
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
    objRef = props.objRef;

    return (
      <g onMouseDown={this.startDragging}>
        <Rect x={objRef.position.x}
              y={objRef.position.y}
              width={objRef.size.x}
              height={objRef.size.y}/>
      </g>
    );
  }
});

module.exports = Node;
