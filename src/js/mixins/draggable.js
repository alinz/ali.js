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
    Mousetrap         = require("mousetrap"),

    //globals
    draggableStarted  = false,
    isDragging        = false,
    draggingStart     = new Vector2D(),
    draggingMove      = new Vector2D(),
    clone             = new Vector2D(),
    globalMeta,
    internalMeta;

function defaultCursor() {
  document.body.className = "";
}

function openHandCursor() {
  var body = document.body;
  if (body.className !== "cursor-open-hand") {
    body.className = "cursor-open-hand";
  }
}

function closeHandCursor() {
  var body = document.body;
  if (body.className !== "cursor-closed-hand") {
    body.className = "cursor-closed-hand";
  }
}


module.exports = {
  initDragging: function () {
    openHandCursor();
  },
  startDragging: function (event) {
    closeHandCursor();

    draggingStart.copyFrom(this.getMouseTouchPosition(event));

    isDragging = true;

    window.addEventListener("mouseup", this.__stopDragging);
    window.addEventListener("mousemove", this.__draggableOnMouseMove);
  },
  __draggableOnMouseMove: function (event) {
    event.stopPropagation();

    if (!isDragging) return;

    closeHandCursor();

    //these two variables are set in a such a way that if the object is scene
    //if the object is a scene object, both global and internal will point to
    //this.state
    //otherwise, globalMeta points to this.props and internalMeta points to
    //this.props.objRef
    if (this.state && this.state.source) {
      internalMeta = globalMeta = this.state;
    } else {
      globalMeta = this.props;
      internalMeta = this.props.objRef;
    }

    draggingMove.copyFrom(this.getMouseTouchPosition(event));
    clone.copyFrom(draggingMove);
    draggingMove.add(draggingStart.reverse())
    draggingStart.copyFrom(clone);

    //if this element doesn't have update properties it means that
    //it's not a scene object. What we need to do is div move position with
    //provided scale.
    if (globalMeta.update) {
      draggingMove.div(globalMeta.scale);
    }

    internalMeta.position.add(draggingMove);

    this.update();
  },
  __stopDragging: function (event) {
    openHandCursor();

    event.stopPropagation();

    isDragging = false;

    window.removeEventListener("mouseup", this.__stopDragging);
    window.removeEventListener("mousemove", this.__draggableOnMouseMove);
  }
};
