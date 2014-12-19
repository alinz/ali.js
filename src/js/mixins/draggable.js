/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var Vector2D          = require("./../util/math/vector2d.js"),
    draggableStarted  = false,
    isDragging        = false,
    draggingStart     = new Vector2D(),
    draggingMove      = new Vector2D(),
    clone             = new Vector2D(),
    metaData;

module.exports = {
  startDragging: function (event) {
    //event.stopPropagation();

    draggingStart.copyFrom(this.getMouseTouchPosition(event));

    isDragging = true;

    window.addEventListener("mouseup", this.__stopDragging);
    window.addEventListener("mousemove", this.__draggableOnMouseMove);
  },
  __draggableOnMouseMove: function (event) {
    event.stopPropagation();

    if (!isDragging) return;

    metaData = this.props;

    draggingMove.copyFrom(this.getMouseTouchPosition(event));
    clone.copyFrom(draggingMove);
    draggingMove.add(draggingStart.reverse())
    draggingStart.copyFrom(clone);

    //if this element doesn't have update properties it means that
    //it's not a scene object. What we need to do is div move position with
    //provided scale.
    if (metaData.update) {
      draggingMove.div(metaData.scale);
    }

    metaData.position.add(draggingMove);

    this.update();
  },
  __stopDragging: function (event) {
    event.stopPropagation();

    isDragging = false;

    window.removeEventListener("mouseup", this.__stopDragging);
    window.removeEventListener("mousemove", this.__draggableOnMouseMove);
  }
};
