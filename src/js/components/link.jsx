/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React     = require("react"),

    //util
    Vector2D  = require("./../util/math/vector2d.js"),

    //components
    Line      = require("./line.jsx"),

    //globals
    props;

var Link = React.createClass({
  propTypes: {
    source: React.PropTypes.instanceOf(Vector2D).isRequired,
    target: React.PropTypes.instanceOf(Vector2D).isRequired
  },
  render: function () {
    props = this.props;

    return (
      <g>
        <Line source={props.source} target={props.target}/>
      </g>
    );
  }
});

module.exports = Link;
