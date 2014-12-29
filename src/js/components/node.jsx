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
    keybind         = require("./../util/keybind.js"),

    //mixins
    DraggableMixin  = require("./../mixins/draggable.js"),
    TouchUtilMixin  = require("./../mixins/touch-util.js"),

    //globals
    sourceClone     = new Vector2D(),
    props,
    objRef,
    tempConnectNodes;

//obj contains 3 variables, position, centerPosition and size
function updateCenterPosition(obj) {
  obj.centerPosition.x = obj.position.x + obj.size.x / 2;
  obj.centerPosition.y = obj.position.y + obj.size.y / 2;
}

var Node = React.createClass({
  mixins: [
    DraggableMixin,
    TouchUtilMixin
  ],
  propTypes: {
    scale: React.PropTypes.number.isRequired,
    label: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired,
    shouldNodeConnect: React.PropTypes.func.isRequired,
    objRef: React.PropTypes.any.isRequired,
    connectNodes: React.PropTypes.any.isRequired
  },
  calculateSize: function () {
    objRef = this.props.objRef;

    if (!(objRef.size instanceof Vector2D)) {
      objRef.size = new Vector2D(100, 100);
    }

    if (!(objRef.centerPosition instanceof Vector2D)) {
      objRef.centerPosition = new Vector2D();
    }

    updateCenterPosition(objRef);
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
  __onMouseDown: function (event) {
    switch (keybind.getCurrentState()) {
      case keybind.constant.Default:
        this.startDragging(event);
        break;
      case keybind.constant.AddLink:
        tempConnectNodes = this.props.connectNodes;
        objRef = this.props.objRef;

        //we need to keep track of id because later we have to bind the
        //source and target nodes.
        tempConnectNodes.source.id = objRef.id;

        sourceClone.copyFrom(this.getMouseTouchPosition(event));

        window.addEventListener("mouseup", this.__stopDynamicLink);
        window.addEventListener("mousemove", this.__onMouseMoveDynamicLink);
        break;
    }
  },
  __stopDynamicLink: function (event) {
    tempConnectNodes = this.props.connectNodes;
    //we just need to set both position similar to make the scene not
    //draw it.
    tempConnectNodes.source.position.copyFrom(tempConnectNodes.target.position);

    window.removeEventListener("mouseup", this.__stopDynamicLink);
    window.removeEventListener("mousemove", this.__onMouseMoveDynamicLink);

    this.update();
  },
  __onMouseMoveDynamicLink: function (event) {
    tempConnectNodes = this.props.connectNodes;

    //we need to override both source and target every time. because
    //at scene section we are applying the transformation.
    tempConnectNodes.source.position.copyFrom(sourceClone);
    tempConnectNodes.target.position.copyFrom(this.getMouseTouchPosition(event));

    this.update();
  },
  __onMouseUp: function () {
    switch (keybind.getCurrentState()) {
      case keybind.constant.AddLink:
        tempConnectNodes = this.props.connectNodes;
        tempConnectNodes.target.id = objRef.id;

        this.props.shouldNodeConnect();

        break;
      default:
        //ignore: do nothing
    }
  },
  render: function () {
    this.calculateSize();

    props = this.props;
    objRef = props.objRef;

    return (
      <g onMouseDown={this.__onMouseDown} onMouseUp={this.__onMouseUp}>
        <Rect x={objRef.position.x}
              y={objRef.position.y}
              width={objRef.size.x}
              height={objRef.size.y}/>
      </g>
    );
  }
});

module.exports = Node;
