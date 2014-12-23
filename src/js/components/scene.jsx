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
    transformMatrix     = [0, 0, 0, 0, 0, 0],
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
