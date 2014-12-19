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
    transform           = "";

React.initializeTouchEvents(true);

function processData(source) {
  var counter = 1,
      result = { nodes: {}, links: [] },
      linkObj,
      nodeObj;

  source.nodes.forEach(function (node) {
    result.nodes[node.id] = {
      id: node.id,
      data: node.data,
      position: new Vector2D(node.position.x, node.position.y),
      size: new Vector2D(),
      links: []
    }
  });

  source.links.forEach(function (link) {
    counter++;
    linkObj = {
      id: "link" + counter,
      source: link.source,
      target: link.target,
      data: link.data
    };

    nodeObj = result.nodes[link.source];

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
  //validating { source: ... } object
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
  getDefaultProps: function () {
    return {
      scale: 1.0,
      position: new Vector2D(0, 0),
    };
  },
  getInitialState: function () {
    return {
      renderTrigger: 0
    };
  },
  componentWillMount: function () {
    this.props.source = processData(this.props.source);
    console.log(this.props.source);
  },
  componentWillReceiveProps: function (nextProps) {
    this.props.source = processData(this.props.source);
  },
  componentDidMount: function () {
    this.startZoom();
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
        links = [];

    transform = "matrix(" + this.props.scale + ",0,0," + this.props.scale + "," + this.props.position.x + "," + this.props.position.y + ")";

    var nodes = Object.keys(this.props.source.nodes).map(function (nodeId, index) {
      nodeObj = this.props.source.nodes[nodeId];
      return <Node key={index}
                   scale={this.props.scale}
                   position={nodeObj.position}
                   label={"node.label"}
                   update={this.update}/>
    }.bind(this));

    this.props.source.links.forEach(function (link) {
      var sourceNode = this.props.source.nodes[link.source],
          targetNode = this.props.source.nodes[link.target];

      console.log("second");
      if (!sourceNode.centerPosition || !targetNode.centerPosition) {
        return;
      }

      links.push(
        <Link id={link.id}
              source={sourceNode.centerPosition}
              target={targetNode.centerPosition}/>
      );
    }.bind(this));

    return (
      <svg onMouseDown={this.startDragging}>
        <g transform={transform}>{links}</g>
        <g transform={transform}>{nodes}</g>
      </svg>
    );
  }
});

module.exports = Scene;
