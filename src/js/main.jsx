"use strict";

var React = require("react"),
    Scene = require("./components/scene.jsx");

React.renderComponent(
  Scene(),
  document.getElementById("content")
);
