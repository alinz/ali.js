/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Constant  = require("./constant.js"),
    NodeClass = require("./node.js"),
    LinkClass = require("./link.js");

function Scene() {
  this.renderedSceneObj = null;
  this.data = {
    meta:{
      position: [0, 0],
      scale: 1.0
    },
    nodes: [],
    links: []
  };
  this.mode = Constant.Mode_Default;

  this.nodeType = "";
  this.linkType = "";

  this.nodeClassesMap = {};
  this.linkClassesMap = {};

  //the following two loops go through all item in classes and assign each
  //class to a map. Everytime an object is requested these map will be used
  //to create a proper object.
  this.getNodesDefinition().forEach(function (nodeImpl) {
    this.nodeClassesMap[nodeImpl.type] = NodeClass.extend(nodeImpl);
  }.bind(this));

  this.getLinksDefinition().forEach(function (linkImpl) {
    this.linkClassesMap[linkImpl.type] = LinkClass.extend(linkImpl);
  }.bind(this));
}

//##############################################################################
//# non override methods
//##############################################################################

Scene.prototype.setMode = function (mode) {
  switch (mode) {
    case Constant.Mode_Default:
      this.renderedSceneObj.modeDefault();
      break;
    case Constant.Mode_Node:
      this.renderedSceneObj.modeNode();
      break;
    case Constant.Mode_Link:
      this.renderedSceneObj.modeLink();
      break;
    default:
      console.log("Unknown Error");
      return;
  }

  this.mode = mode;
};

Scene.prototype.setNodeType = function (nodeType) {
  if (this.mode !== Constant.Mode_Node) {
    console.log("Mode is not Mode_Node");
    return;
  }

  if (!this.nodeClassesMap[nodeType]) {
    console.log("Node with '" + nodeType + "' not found.");
    return;
  }

  this.nodeType = nodeType;
};

Scene.prototype.setLinkType = function (linkType) {
  if (this.mode !== Constant.Mode_Link) {
    console.log("Mode is not Mode_Node");
    return;
  }

  if (!this.linkClassesMap[linkType]) {
    console.log("Link with '" + linkType + "' not found.");
    return;
  }

  this.linkType = linkType;
};

//@private method
Scene.prototype.createNode = function (position) {
  //position is value of click mouse position.
  var constScenePosition = this.renderedSceneObj.state.position,
      constSceneScale = this.renderedSceneObj.state.scale,
      NodeClass = this.nodeClassesMap[this.nodeType],
      node = new NodeClass();

  /*
    example:
    click on (100, 100)
    page position is (-10, -10)
   */
  node.position.add(position);
  node.position.sub(constScenePosition);
  node.size.div(2);
  node.position.sub(node.size);
  node.size.div(0.5);

  this.sceneWillCreateNode(node, function () {

    

  }.bind(this), function () {

  }.bind(this));

  console.log(node);
};

/*
  imports data that represents scene data

  data consits of 3 major fields
  1: meta <Object>
    {
      position: [0, 0],
      scale: 0
    },

  2: nodes <Array>
    [
      {
        type: "RabbitMQ",

        attributes: {
          id:       "node:1",
          position: [0, 0],
          size:     [0, 0],
          label:    "LABEL"
        }
      },
      ...
    ]
  3: links <Array>
    [
      {
        type: "TCP",

        attributes: {
          id:     "link:10",
          source: "node:1",
          target: "node:5"
        }
      },
      ...
    ]
*/
Scene.prototype.import = function (data) {
  this.renderedSceneObj.fromJSON(data);
  return this;
};

Scene.prototype.export = function () {
  return this.renderedSceneObj.toJSON();
};

//##############################################################################
//# optional override mthods
//##############################################################################
Scene.prototype.sceneDidReady = function () { };
Scene.prototype.sceneWillCreateNode = function (node, proceed, stop) {
  proceed();
};

Scene.prototype.sceneWillConnectNodes = function (nodeA, nodeB, link, proceed, stop) {
  proceed();
};

Scene.prototype.sceneDidCreateNode = function (node) {};
Scene.prototype.sceneDidConnectNodes = function (nodeA, nodeB, link) { };
Scene.prototype.sceneDidRequestNodeInfo = function (node) { };
Scene.prototype.sceneDidRequestLinkInfo = function (link) { };

module.exports = Scene;
