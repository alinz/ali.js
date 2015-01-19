/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React               = require("react/addons"),

    //utils
    Vector2D            = require("./../util/math/vector2d.js"),
    generator           = require("./../util/generator.js"),
    Constant            = require("./../constant.js"),

    //mixins
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin      = require("./../mixins/touch-util.js"),
    ZoomMixin           = require("./../mixins/zoom.js"),
    EventEmitterMixin   = require("./../mixins/event-emitter.js"),
    DraggableMixin      = require("./../mixins/draggable.js"),

    //components
    Node                = require("./node.jsx"),
    Link                = require("./link.jsx"),
    Line                = require("./line.jsx"),

    //global variables
    classSet            = React.addons.classSet,
    transformMatrix     = [0, 0, 0, 0, 0, 0],
    transform           = "",

    dynamicLineId       = generator.genLinkId(),
    dynamicLine,

    mousePosition       = new Vector2D();


function tryCall(func) {
  if (!func()) {
    setTimeout(function () {
      tryCall(func);
    }, 100);
  }
}

React.initializeTouchEvents(true);

var Scene = React.createClass({
  mixins: [
    AnimationFrameMixin,
    TouchUtilMixin,
    EventEmitterMixin,
    ZoomMixin,
    DraggableMixin
  ],
  //this method called when the default key is being pressed.
  //default key by default is Esc key which resets all the states to origianl
  modeDefault: function () {
    this.enableDragging(true);
  },
  modeNode: function () {
    //we need to disable the dragging and panning.
    this.enableDragging(false);
  },
  modeLink: function () {

  },
  toJSON: function() {
    var state = this.state,
        json = {
          meta: {
            position: [state.position.x, state.position.y],
            scale: state.scale
          },
          nodes: [],
          links: []
        };

    //copy all nodes to json object
    state.nodes.forEach(function (node) {
      json.nodes.push({
        id:       node.id,
        type:     node.type,
        position: [node.position.x, node.position.y],
        size:     [node.size.x, node.size.y],
        label:    node.label
      });
    });

    //copy all links to json object
    state.links.forEach(function (link) {
      json.links.push({
        id:     link.id,
        type:   link.type,
        source: link.source.id || link.source,
        target: link.target.id || link.target
      });
    });

    return json;
  },
  fromJSON: function (data) {
    var state = this.state;

    //reset nodesMap
    state.nodesMap = {};

    data = "string" === typeof data? JSON.parse(data) : data;

    //configure global camera panning and scale
    state.position.x = data.meta.position[0];
    state.position.y = data.meta.position[1];
    state.scale = data.meta.scale;

    //these are temporary variables which only use internally
    state.connectNodes.source.id = ""
    state.connectNodes.source.position.x = 0;
    state.connectNodes.source.position.y = 0;

    state.connectNodes.target.id = ""
    state.connectNodes.target.position.x = 0;
    state.connectNodes.target.position.y = 0;

    state.renderTrigger = 0;

    //convert postion from javascript array to Vector2D
    //construct nodesMap to extract node object by id in O(1)
    //for next loop
    data.nodes.forEach(function (node) {
      node.positon = new Vector2D(node.position.x, node.position.y);
      state.nodesMap[node.id] = node;
    });

    //finally assign jsonObject to state.data
    state.data = data;
  },
  getInitialState: function () {
    var state = {
      scale: 1.0,
      position: new Vector2D(0, 0),
      renderTrigger: 0,

      //this map is uses in render to find source and target of
      //connected nodes.
      nodesMap: {},

      connectNodes: {
        source: { id: "", position: new Vector2D() },
        target: { id: "", position: new Vector2D() }
      },
      data: null
    };
    return state;
  },
  componentWillReceiveProps: function (props) {
    this.sceneObj = props.scene;
    this.fromJSON(props.data);
  },
  componentWillMount: function () {
    this.sceneObj = this.props.scene;
    this.fromJSON(this.props.data);
  },
  componentDidMount: function () {
    this.startZoom();
    this.initDragging();

    //because scene object is called first we need to make it
    //delay.
    tryCall(function () {
      if (this.sceneObj.renderedSceneObj) {
        this.sceneObj.sceneDidReady();
        return true;
      }
      return false;
    }.bind(this));
  },
  componentWillUnmount: function () {
    this.stopZoom();
  },
  update: function () {
    this.setStateAnimationFrame({
      renderTrigger: this.state.renderTrigger++
    });
  },
  shouldNodeConnect: function () {
    var state         = this.state,
        connectNodes  = state.connectNodes;

    this.sceneObj.connectNodes(state.nodesMap[connectNodes.source.id],
                               state.nodesMap[connectNodes.target.id]);
  },
  onClick: function (event) {
    var internalMousePosition;

    if (this.sceneObj.mode === Constant.Mode_Node) {
      internalMousePosition = new Vector2D();
      internalMousePosition.copyFrom(this.getMouseTouchPosition(event));
      this.sceneObj.createNode(internalMousePosition);
    }
  },
  //this method is called by Scene object only
  addNode: function (node) {
    this.state.nodesMap[node.id] = node;
    this.state.data.nodes.push(node);
  },
  //this method is called by Scene object only
  addLink: function (link) {
    this.state.data.links.push(link);
  },
  getMode: function () {
    return this.sceneObj.mode;
  },
  render: function () {
    var nodeObj,
        nodes = [],
        dynamicLink,
        links = [],
        state = this.state,
        classNamesObj = {
          "ali-svg": true
        },
        classNames = "";

    classNames = classSet(classNamesObj);

    state.data.nodes.forEach(function (node) {
      nodes.push(
        <Node key={node.id}
              scale={state.scale}
              objRef={node}
              shouldNodeConnect={this.shouldNodeConnect}
              update={this.update}
              connectNodes={state.connectNodes}
              mode={this.getMode}/>
      );
    }.bind(this));

    state.data.links.forEach(function (link) {
      var sourceNode = state.nodesMap[link.source],
          targetNode = state.nodesMap[link.target];

      links.push(
        <Link key={link.id}
              objRef={link}
              source={sourceNode}
              target={targetNode}/>
      );
    }.bind(this));

    transformMatrix[0] = state.scale;
    transformMatrix[3] = state.scale;
    transformMatrix[4] = state.position.x;
    transformMatrix[5] = state.position.y;

    transform = "matrix(" + transformMatrix.join(",") + ")";

    //we need to do the transformation here to make sure line is align.
    state.connectNodes.source.position.sub(state.position);
    state.connectNodes.target.position.sub(state.position);
    state.connectNodes.source.position.div(state.scale);
    state.connectNodes.target.position.div(state.scale);

    dynamicLine = null;
    if (state.connectNodes.source.position.distance(
          state.connectNodes.target.position) > 0) {
      dynamicLine = (<Line key={dynamicLineId}
                           source={state.connectNodes.source.position}
                           target={state.connectNodes.target.position}/>);
    }

    return (
      <svg className={classNames}
           onMouseDown={this.startDragging}
           onClick={this.onClick}>
        <g transform={transform}>{dynamicLine}</g>
        <g transform={transform}>{nodes}</g>
        <g transform={transform}>{links}</g>
      </svg>
    );
  }
});

module.exports = Scene;
