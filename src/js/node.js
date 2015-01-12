/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Extend = require("./util/extend.js");

function Node() { }

Node.extend = function (extendNode) {
  var attributes = extendNode.attributes || {};

  delete extendNode.attributes;

  //we are deleting this property because it tries to set function.name property
  //which causes javascript to throw an exception.
  delete extendNode.name;

  return Extend(Node, attributes, extendNode);
};

module.exports = Node;
