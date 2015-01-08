/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var genId   = require("./util/generator.js").genId,

    //global variables
    state   = {};

module.exports = {
  get: function (key) {
    return "undefined" !== typeof key? state[key] : state;
  },

  set: function (key, value) {
    currentState[key] = value;
  },

  Key: {
    Mode:             genId(), 
  },

  Mode: {
    Default:          genId(),
    Node:             genId(),
    Link:             genId()
  }
};
