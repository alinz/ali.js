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
    props,
    objRef,
    tempConnectNodes,

    draggingStart     = new Vector2D(),
    draggingMove      = new Vector2D(),
    clone             = new Vector2D();


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

        //set connectNodes source variable
        tempConnectNodes.source.centerPosition.copyFrom(objRef.centerPosition);
        tempConnectNodes.source.size.copyFrom(objRef.size);
        tempConnectNodes.source.position.copyFrom(objRef.position);

        //tempConnectNodes.target.size.div(this.props.scale);

        //set connectNodes target variables except size
        tempConnectNodes.target.position.x = event.clientX;
        tempConnectNodes.target.position.y = event.clientY;
        //calculate center
        updateCenterPosition(tempConnectNodes.target);

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

    //set connectNodes target variables except size
    tempConnectNodes.target.position.x = event.clientX;
    tempConnectNodes.target.position.y = event.clientY;

    console.log(this.props.scale);

    // tempConnectNodes.target.position.x -= tempConnectNodes.target.size.x / 2;
    // tempConnectNodes.target.position.y -= tempConnectNodes.target.size.y / 2;

    //tempConnectNodes.target.position.div(this.props.scale);

    //calculate center
    updateCenterPosition(tempConnectNodes.target);

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
