/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var generator   = require("./util/generator.js"),

    //utilities
    Extend      = require("./util/extend.js"),

    //math
    Vector2D    = require("./util/math/vector2d.js");

function Node() {
  //id will be overrided once we loaded the object from JSON
  this.id             = generator.genNodeId();
  
  this.position       = new Vector2D();
  this.size           = new Vector2D(100, 100);
  this.centerPosition = new Vector2D();
}

Node.extend = function (extendNode) {
  var attributes = extendNode.attributes || {};

  delete extendNode.attributes;

  //we are deleting this property because it tries to set function.name property
  //which causes javascript to throw an exception.
  delete extendNode.name;

  return Extend(Node, attributes, extendNode);
};

module.exports = Node;
