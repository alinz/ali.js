/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Mode = require("./constant.js").Mode,
    Node = require("./node.js"),
    Link = require("./link.js");

function Scene() {
  this.renderedSceneObj = null;
  this.data = { nodes: [], links: [] };
  this.mode = Mode.Default;

  this.nodes = this.getNodesDefinition().map(function (nodeImpl) {
    return Node.extend(nodeImpl);
  });
  
  this.links = this.getLinksDefinition().map(function (linkImpl) {
    return Link.extend(linkImpl);
  });

  console.log(this.nodes);
  console.log(this.links);
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

Scene.prototype.camera = function (x, y, z) {

};

/*
  imports data that represents scene data

  data consits of 3 major fields
  1: meta <Object>
    { position: [], scale: 0 }

  2: nodes <Array>
    [
      {
        id: "node:1",
        type: "RabbitMQ",

        attributes: {
          position: [0, 0],
          size: [0, 0],
          label: "LABEL"
        }
      },
      ...
    ]
  3: links <Array>
    [
      {
        id: "link:10",
        type: "TCP",

        attributes: {
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

Scene.prototype.sceneDidCreateNode = function (node) {};

Scene.prototype.sceneWillConnectNodes = function (nodeA, nodeB, link, proceed, stop) {
  proceed();
};

Scene.prototype.sceneDidConnectNodes = function (nodeA, nodeB, link) {};

module.exports = Scene;
