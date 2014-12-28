/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React               = require("react"),

    //utils
    Vector2D            = require("./../util/math/vector2d.js"),
    keybind             = require("./../util/keybind.js"),
    generator           = require("./../util/generator.js"),
    cursor              = require("./../util/cursor.js"),

    //mixins
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin      = require("./../mixins/touch-util.js"),
    ZoomMixin           = require("./../mixins/zoom.js"),
    EventEmitterMixin   = require("./../mixins/event-emitter.js"),
    DraggableMixin      = require("./../mixins/draggable.js"),

    //components
    Node                = require("./node.jsx"),
    Link                = require("./link.jsx"),

    //global variables
    cursorClasses       = cursor.classes,
    transformMatrix     = [0, 0, 0, 0, 0, 0],
    transform           = "";

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
    tempId = "node:" + generator.genId();
    mapId[node.id] = tempId;

    result.nodes[tempId] = {
      id: tempId,
      data: node.data,
      position: new Vector2D(node.position.x, node.position.y),
      links: []
    }
  });

  source.links.forEach(function (link) {
    tempId = "link:" + generator.genId();

    tempSource = mapId[link.source];
    tempTarget = mapId[link.target];

    linkObj = {
      id: tempId,
      source: tempSource,
      target: tempTarget,
      data: link.data
    };

    nodeObj = result.nodes[tempSource];

    if (!nodeObj) {
      throw "a link tries to connect to a non-exists node.";
    }

    nodeObj.links.push(linkObj);
    result.links.push(linkObj);
  });

  return result;
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
    var tempId = "node:" + generator.genId();

    this.state.source.nodes[tempId] = {
      id: tempId,
      data: null,
      position: new Vector2D(),
      links: []
    };

    this.update();
  },
  //this method called when the default key is being pressed.
  //default key by default is Esc key which resets all the states to origianl
  __defaultSetting: function () {
    this.enableDragging(true);
    cursor.set(cursorClasses.OpenHand);
  },
  __addNewLink: function () {
    //we need to disable the dragging and panning.
    this.enableDragging(false);
    cursor.set(cursorClasses.Default);
  },
  getInitialState: function () {
    return {
      scale: 1.0,
      position: new Vector2D(),
      source: null,
      renderTrigger: 0
    };
  },
  componentWillMount: function () {
    this.state.source = processData(this.props.source);
  },
  componentWillReceiveProps: function (nextProps) {
    this.state.source = processData(this.props.source);
  },
  componentDidMount: function () {
    this.startZoom();
    this.initDragging();

    keybind.bind(keybind.constant.AddNode, this.__addNewNode);
    keybind.bind(keybind.constant.AddLink, this.__addNewLink);
    keybind.bind(keybind.constant.Default, this.__defaultSetting);
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
    var nodeObj,
        nodes,
        links = [],
        state = this.state;

    nodes = Object.keys(state.source.nodes).map(function (nodeId) {
      nodeObj = state.source.nodes[nodeId];

      return <Node key={nodeObj.id}
                   scale={state.scale}
                   objRef={nodeObj}
                   label={"node.label"}
                   update={this.update}/>
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

    //<g dangerouslySetInnerHTML={{__html: '<use xlink:href="#group-nodes"/>'}}/>

    return (
      <svg onMouseDown={this.startDragging}>
        <g transform={transform}>{nodes}</g>
        <g transform={transform}>{links}</g>
      </svg>
    );
  }
});

module.exports = Scene;
