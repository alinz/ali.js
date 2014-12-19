/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Vector2D  = require("./../util/math/vector2d.js"),

    //gloabls
    value     = new Vector2D(),
    x, y;

module.exports = {
  getMouseTouchPosition: function (event) {
    if (event.touches) {
      x = event.touches[0].pageX;
      y = event.touches[0].pageY;
    } else {
      x = event.pageX;
      y = event.pageY;
    }

    value.assign(x, y);

    return value;
  }
};
