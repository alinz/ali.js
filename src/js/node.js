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
  return Extend(Node, extendNode.attributes || {}, extendNode.meta || {});
};

module.exports = Node;
