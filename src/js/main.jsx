"use strict";

var React = require("react"),
    Scene = React.createFactory(require("./components/scene.jsx"));

React.render(
  Scene(),
  document.getElementById("content")
);
