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
    cursorClasses       = cursor.classes,
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
  __defaultSetting: function () {
    this.enableDragging(true);
    cursor.set(cursorClasses.OpenHand);
  },
  __addNewLink: function () {
    //we need to disable the dragging and panning.
    this.enableDragging(false);
    cursor.set(cursorClasses.Pointer);
  },
  __saveAsFile: function (event) {
    event.preventDefault();

    var state = this.state,
        obj = objectToJSON(state.source),
        contentAsString;

    obj.meta = {
      scale: state.scale,
      position: {
        x: state.position.x,
        y: state.position.y
      }
    };

    contentAsString = JSON.stringify(obj);

    file.saveAs("ali.json", contentAsString, "text/json");

    keybind.trigger(keybind.constant.Default);
  },
  __loadAsFile: function (event) {
    event.preventDefault();

    var file = event.dataTransfer.files[0],
        reader = new FileReader();

    reader.onload = function(e) {
      var content = e.target.result,
          obj = JSON.parse(content);

      //configure global camera panning and scale
      this.state.position.x = obj.meta.position.x;
      this.state.position.y = obj.meta.position.y;
      this.state.scale = obj.meta.scale;

      //load all the nodes and links
      this.state.source = processData(obj);

      //request for redraw
      this.update();
    }.bind(this);

    reader.readAsText(file);
  },
  __ignore: function (event) {
    event.preventDefault();
  },
  getInitialState: function () {
    return {
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
    keybind.bind(keybind.constant.Save, this.__saveAsFile);
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
        state = this.state;

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
      <svg onMouseDown={this.startDragging}
           onDragOver={this.__ignore}
           onDragEnter={this.__ignore}
           onDrop={this.__loadAsFile}>
        <g transform={transform}>{dynamicLine}</g>
        <g transform={transform}>{nodes}</g>
        <g transform={transform}>{links}</g>
      </svg>
    );
  }
});

module.exports = Scene;
