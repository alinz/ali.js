/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React = require("react"),
    Scene = require("./components/scene.jsx"),

    data = { nodes:[], links:[] };

React.render(
  <Scene source={data}/>,
  document.getElementById("content")
);
