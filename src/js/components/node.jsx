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
    Constant        = require("./../constant.js"),

    //mixins
    DraggableMixin  = require("./../mixins/draggable.js"),
    TouchUtilMixin  = require("./../mixins/touch-util.js"),

    //Classes
    NodeClass       = require("./../node.js"),

    //globals
    sourceClone     = new Vector2D(),
    props,
    nodeRef,
    tempConnectNodes,

    //I need these two pointers which point to function which contains
    //listeners.
    mouseUpPtr,
    mouseMovePtr;

//obj contains 3 variables, position, centerPosition and size
function updateCenterPosition(obj) {
  obj.centerPosition.x = obj.position.x + obj.size.x / 2;
  obj.centerPosition.y = obj.position.y + obj.size.y / 2;
}

/*
  This node receives the follwoing properties from Scene Render Object
  nodeRef: it is an object of node which contains
        {label, size and position}
        all the updates must be happening with this object.

  update: it is a function which triggers scene render update.
  shouldNodeConnect: this is a function which will be called once 2 nodes are
                     connected. The decision will be made based on Scene Impl.

  connectNodes: is an object contains source and target which is updated by
                node to be sent to Scene object to see whether these node
                can be connected.

 */
var Node = React.createClass({
  mixins: [
    DraggableMixin,
    TouchUtilMixin
  ],
  propTypes: {
    nodeRef: React.PropTypes.instanceOf(NodeClass).isRequired,
    update: React.PropTypes.func.isRequired,
    shouldNodeConnect: React.PropTypes.func.isRequired,
    connectNodes: React.PropTypes.any.isRequired,
    mode: React.PropTypes.func.isRequired
  },
  calculateSize: function () {
    nodeRef = this.props.nodeRef;

    if (!(nodeRef.size instanceof Vector2D)) {
      nodeRef.size = new Vector2D(100, 100);
    }

    if (!(nodeRef.centerPosition instanceof Vector2D)) {
      nodeRef.centerPosition = new Vector2D();
    }

    updateCenterPosition(nodeRef);
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
    switch (this.props.mode()) {
      case Constant.Mode_Default:
        this.startDragging(event);
        break;
      case Constant.Mode_Link:
        tempConnectNodes = this.props.connectNodes;
        nodeRef = this.props.nodeRef;

        //we need to keep track of id because later we have to bind the
        //source and target nodes.
        tempConnectNodes.source.id = nodeRef.id;

        sourceClone.copyFrom(this.getMouseTouchPosition(event));

        //remove the previous global handlers
        if (mouseUpPtr) {
          window.removeEventListener("mouseup", mouseUpPtr);
        }

        if (mouseMovePtr) {
          window.removeEventListener("mousemove", mouseMovePtr);
        }

        //create a brand new global handlers
        mouseUpPtr = function (event) {
          this.__stopDynamicLink(event);
        }.bind(this);

        mouseMovePtr = function (event) {
          this.__onMouseMoveDynamicLink(event);
        }.bind(this);

        //attach brand new handlers
        window.addEventListener("mouseup", mouseUpPtr);
        window.addEventListener("mousemove", mouseMovePtr);
        break;
    }
  },
  __stopDynamicLink: function (event) {
    tempConnectNodes = this.props.connectNodes;
    //we just need to set both position similar to make the scene not
    //draw it.
    tempConnectNodes.source.position.copyFrom(tempConnectNodes.target.position);

    //remove global handlers
    if (mouseUpPtr) {
      window.removeEventListener("mouseup", mouseUpPtr);
      mouseUpPtr = null;
    }

    if (mouseMovePtr) {
      window.removeEventListener("mousemove", mouseMovePtr);
      mouseMovePtr = null;
    }

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
    nodeRef = this.props.nodeRef;

    switch (this.props.mode()) {
      case Constant.Mode_Link:
        tempConnectNodes = this.props.connectNodes;
        tempConnectNodes.target.id = nodeRef.id;

        this.props.shouldNodeConnect();

        break;
      default:
        //ignore: do nothing
    }
  },
  render: function () {
    this.calculateSize();

    props = this.props;
    nodeRef = props.nodeRef;

    return (
      <g onMouseDown={this.__onMouseDown} onMouseUp={this.__onMouseUp}>
        <Rect x={nodeRef.position.x}
              y={nodeRef.position.y}
              width={nodeRef.size.x}
              height={nodeRef.size.y}/>
      </g>
    );
  }
});

module.exports = Node;
