/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Merge = require("./merge.js");

module.exports = function (funcClass, ObjectAttributes, ClassAttributes) {
  var objectProperties = {};

  function ExtendClass() {
    funcClass.call(this);
    Merge.object(this, objectProperties);
  }

  //inheritance
  ExtendClass.prototype = Object.create(funcClass);
  ExtendClass.prototype.constructor = ExtendClass;

  //this section merges function only properties to prototypes and
  //reserved the object attributes to this pointer at constructor level.
  Merge.object(ExtendClass.prototype, objectProperties, function (key, value) {
    if ("function" !== typeof value) {
      objectProperties[key] = value;
      return false;
    }

    return true;
  });
};
