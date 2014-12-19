/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

module.exports = {
  on: function (event, func) {
    this.getDOMNode().addEventListener(event, func);
  },
  off: function (event, func) {
    this.getDOMNode().removeEventListener(event, func);
  },
  trigger: function (event, data, bubbles) {
    bubbles = bubbles || true;
    var eventObject = new CustomEvent(event, {
      detail: data,
      bubbles: bubbles
    });
    this.getDOMNode().dispatchEvent(eventObject);
  }
};
