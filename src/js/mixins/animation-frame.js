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
