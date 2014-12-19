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

    data = {
      links: [
        {
          source: "node1",
          target: "node2",
          data: []
        }
      ],
      nodes: [
        {
          id: "node1",
          data: [],
          position: {
            x: 10,
            y: 20
          }
        },
        {
          id: "node2",
          data: [],
          position: {
            x: 40,
            y: 20
          }
        }
      ]
    };

React.render(
  <Scene source={data}/>,
  document.getElementById("content")
);
