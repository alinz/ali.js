/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Extend      = require("./util/extend.js"),
    generator   = require("./util/generator.js");

function Link() {
  //id will be overrided once we loaded the object from JSON
  this.id = generator.genLinkId();

  this.source = "";
  this.target = "";
}

Link.extend = function (extendLink) {
  var attributes = extendLink.attributes || {};
  delete extendLink.attributes;

  //we are deleting this property because it tries to set function.name property
  //which causes javascript to throw an exception.
  delete extendLink.name;

  return Extend(Link, attributes, extendLink);
};

module.exports = Link;
