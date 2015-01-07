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
    keybind             = require("./../util/keybind.js"),
    generator           = require("./../util/generator.js"),
    file                = require("./../util/file.js"),

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
    dynamicLine;

React.initializeTouchEvents(true);

function processData(source) {
  var result = { nodes: {}, links: [] },
      linkObj,
      nodeObj,
      tempId,
      tempSource,
      tempTarget;

  //we need to generate id per load. as an example,
  //if some node generated and deleted, the ranaming id can
  //be overriden by new node. So by having a a convertorMap,
  //we can generate id per load.
  var mapId = {};

  source.nodes.forEach(function (node) {
    tempId = generator.genNodeId();
    mapId[node.id] = tempId;

    result.nodes[tempId] = {
      id: tempId,
      data: node.data,
      position: new Vector2D(node.position.x, node.position.y)
    }
  });

  source.links.forEach(function (link) {
    tempSource = mapId[link.source];
    tempTarget = mapId[link.target];

    linkObj = {
      id: generator.genLinkId(),
      source: tempSource,
      target: tempTarget,
      data: link.data
    };

    nodeObj = result.nodes[tempSource];

    if (!nodeObj) {
      throw "a link tries to connect to a non-exists node.";
    }

    result.links.push(linkObj);
  });

  return result;
}

function objectToJSON(obj) {
  var data = { links: [], nodes: [] },
      node;

  Object.keys(obj.nodes).forEach(function (nodeId) {
      node = obj.nodes[nodeId];
      data.nodes.push({
        id: node.id,
        data: node.data,
        position: {
          x: node.position.x,
          y: node.position.y
        }
      });
  });

  obj.links.forEach(function (link) {
    data.links.push({
      id: link.id,
      source: link.source,
      target: link.target,
      data: link.data
    });
  });

  return data;
}


var Scene = React.createClass({
  mixins: [
    AnimationFrameMixin,
    TouchUtilMixin,
    EventEmitterMixin,
    ZoomMixin,
    DraggableMixin
  ],
  propTypes: {
    source: React.PropTypes.shape(
      {
        links: React.PropTypes.arrayOf(
          React.PropTypes.shape(
            {
              source: React.PropTypes.string.isRequired,
              target: React.PropTypes.string.isRequired,
              data: React.PropTypes.arrayOf(React.PropTypes.any).isOptional
            }
          )//end of shape of each element in links array
        ),//end of links
        nodes: React.PropTypes.arrayOf(
          React.PropTypes.shape(
            {
              id: React.PropTypes.string.isRequired,
              data: React.PropTypes.arrayOf(React.PropTypes.any).isOptional,
              position: React.PropTypes.shape(
                {
                  x: React.PropTypes.number.isRequired,
                  y: React.PropTypes.number.isRequired
                }
              ).isRequired //end of shape of position
            }
          )//end of shape of each node in nodes array
        )//end of nodes
      }//end of shape of source
    )//end of source
  },
  __addNewNode: function () {
    var tempId = generator.genNodeId();

    this.state.source.nodes[tempId] = {
      id: tempId,
      data: null,
      position: new Vector2D()
    };

    //we set the key back to default.
    keybind.trigger(keybind.constant.Default);

    this.update();
  },
  //this method called when the default key is being pressed.
  //default key by default is Esc key which resets all the states to origianl
  modeDefault: function () {
    this.enableDragging(true);
    this.setCursor("ali-cursor-default");
  },
  modeNode: function () {
    //we need to disable the dragging and panning.
    this.enableDragging(false);
    this.setCursor("ali-cursor-node");
  },
  modeLink: function () {
    this.setCursor("ali-cursor-link");
  },
  toJSON: function() {
    var state = this.state,
        obj = objectToJSON(state.source);

    obj.meta = {
      scale: state.scale,
      position: {
        x: state.position.x,
        y: state.position.y
      }
    };

    return JSON.stringify(obj);
  },
  fromJSON: function (json) {
    var obj = JSON.parse(json),
      state = this.state;

    //configure global camera panning and scale
    state.position.x = obj.meta.position.x;
    state.position.y = obj.meta.position.y;
    state.scale = obj.meta.scale;

    //load all the nodes and links
    state.source = processData(obj);
  },
  getInitialState: function () {
    var state = {
      //this variable will be used to keep track of timeout
      timeoutHandler: 0,
      cursorClassName: "",
      scale: 1.0,
      position: new Vector2D(),
      source: null,
      connectNodes: {
          source: {
            id: "",
            position: new Vector2D()
          },
          target: {
            id: "",
            position: new Vector2D()
          }
      },
      renderTrigger: 0
    };
    return state;
  },
  componentWillMount: function () {
    if (!this.state.source){
      this.state.source = processData(this.props.data);
    }
  },
  componentWillReceiveProps: function (nextProps) {
    this.state.source = processData(this.props.data);
  },
  componentDidMount: function () {
    this.startZoom();
    this.initDragging();
  },
  setCursor: function (className) {
    this.state.cursorClassName = className;
    this.update();
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
        connectNodes  = state.connectNodes,
        links         = state.source.links,

        linkId        = generator.genLinkId();

    links.push({
      id: linkId,
      source: connectNodes.source.id,
      target: connectNodes.target.id,
      data: null
    });
  },
  render: function () {
    var nodeObj,
        nodes,
        dynamicLink,
        links = [],
        state = this.state,
        classNamesObj = {},
        classNames = "";

    classNamesObj[this.state.cursorClassName] = true;
    classNames = classSet(classNamesObj);

    nodes = Object.keys(state.source.nodes).map(function (nodeId) {
      nodeObj = state.source.nodes[nodeId];

      return <Node key={nodeObj.id}
                   scale={state.scale}
                   objRef={nodeObj}
                   label={"node.label"}
                   shouldNodeConnect={this.shouldNodeConnect}
                   update={this.update}
                   connectNodes={state.connectNodes}/>
    }.bind(this));

    state.source.links.forEach(function (link) {
      var sourceNode = state.source.nodes[link.source],
          targetNode = state.source.nodes[link.target];

      links.push(
        <Link key={link.id}
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
      <svg className={classNames} onMouseDown={this.startDragging}>
        <g transform={transform}>{dynamicLine}</g>
        <g transform={transform}>{nodes}</g>
        <g transform={transform}>{links}</g>
      </svg>
    );
  }
});

module.exports = Scene;
