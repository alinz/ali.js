"use strict";

var Vector2D = require("./../util/math/vector2d.js"),
    draggableStarted = false,
    isDragging = false,
    draggingStart = new Vector2D(),
    draggingMove = new Vector2D(),
    clone = new Vector2D(),
    metaData;

function draggableOnMouseDown(event) {
  event.stopPropagation();

  draggingStart.copyFrom(this.getMouseTouchPosition(event));

  isDragging = true;

  window.addEventListener("mouseup", draggableOnMouseUp.bind(this));
  window.addEventListener("mousemove", draggableOnMouseMove.bind(this));
}

function draggableOnMouseMove(event) {
  event.stopPropagation();

  if (!isDragging) return;

  metaData = this.props;

  draggingMove.copyFrom(this.getMouseTouchPosition(event));
  clone.copyFrom(draggingMove);
  draggingMove.add(draggingStart.reverse())
  draggingStart.copyFrom(clone);

  if (metaData.scale) {
    //draggingMove.div(metaData.scale);
  }

  metaData.position.add(draggingMove);

  this.update();
}

function draggableOnMouseUp(event) {
  event.stopPropagation();

  isDragging = false;

  window.removeEventListener("mouseup", draggableOnMouseUp);
  window.removeEventListener("mousemove", draggableOnMouseMove);
}

module.exports = {
  startDragging: function () {
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
  stopDragging: function () {
    if (draggableStarted) {
      this.off("mousedown", draggableOnMouseDown);
      draggableStarted = false;
    }
  }
};
