/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

var Vector2D = require("./vector2d.js");

var Physics = {
  collision: {
    boundingBox: function (centerA, sizeA, centerB, sizeB) {
      return Math.abs(centerA.x - centerB.x) * 2 < (sizeA.x + sizeB.x) &&
             Math.abs(centerA.y - centerB.y) * 2 < (sizeA.y + sizeB.y);
    }
  }
};

module.exports = Physics;
