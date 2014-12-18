"use strict";

var Vector2D = require("./../util/math/vector2d.js"),
    draggableStarted = false,
    isDragging = false,
    draggingStart = new Vector2D(),
    draggingMove = new Vector2D(),
    clone = new Vector2D(),
    position;

function draggableOnMouseDown(event) {
  event.stopPropagation();

  position = this.getMouseTouchPosition(event);
  draggingStart.copyFrom(position);

  isDragging = true;

  window.addEventListener("mouseup", draggableOnMouseUp.bind(this));
  window.addEventListener("mousemove", draggableOnMouseMove.bind(this));
}

function draggableOnMouseMove(event) {
  event.stopPropagation();

  if (isDragging) return;

  draggingMove.copyFrom(this.getMouseTouchPosition(event));
  clone.copyFrom(draggingMove);
  draggingMove.add(draggingStart.reverse())
  draggingStart.copyFrom(clone);

  if (this.props.appMetaData) {
    draggingMove.div(this.props.appMetaData.scale);
  }

  this.props.metaData.position.add(draggingMove);

  this.props.metaData.requestRender = true;
}

function draggableOnMouseUp(event) {
  event.stopPropagation();

  isDragging = false;

  window.removeEventListener("mouseup", draggableOnMouseUp);
  window.removeEventListener("mousemove", draggableOnMouseMove);
}

module.exports = {
  startDraggable: function () {
    if (!this.getMouseTouchPosition) {
      throw "TouchUtilMixin is missing.";
    }

    if (!this.on) {
      throw "EventEmitterMixin is missing.";
    }

    if (!draggableStarted) {
      this.on("mousedown", draggableOnMouseDown.bind(this));
      draggableStarted = true;
    }
  },
  stopDraggable: function () {
    if (draggableStarted) {
      this.off("mousedown", draggableOnMouseDown);
      draggableStarted = false;
    }
  }
};
