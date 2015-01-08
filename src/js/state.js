/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var currentState = {};

module.exports = {
  get: function (key) {
    switch (typeof key) {
      case "string":
        return currentState[key];
      case "undefined":
        return currentState;
      default:
        return;
    }
  },
  set: function (key, value) {
    currentState[key] = value;
  }
}
