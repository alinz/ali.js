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
  this.data = { nodes: [], links: [] };
  this.mode = Constant.Mode_Default;

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

Scene.prototype.mode = function (mode) {
  if (mode) {
    this.mode = mode;
    return this;
  } else {
    return this.mode;
  }
};

Scene.prototype.setCursor = function (className) {
  this.renderedSceneObj.setCursor(className);
};

Scene.prototype.setMode = function (mode) {
  this.mode = mode;
};

Scene.prototype.setNodeType = function (nodeType) {

};

Scene.prototype.setLinkType = function (linkType) {

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
