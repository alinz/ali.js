/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var requestAnimationFrame = window.requestAnimationFrame       ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame    ||
                            window.msRequestAnimationFrame;

module.exports = {
  setStateAnimationFrame: function (options) {
    var that = this;
    requestAnimationFrame(function () {
      that.setState(options);
    });
  }
};
