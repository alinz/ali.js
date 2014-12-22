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
    source: React.PropTypes.any.isRequired,
    target: React.PropTypes.any.isRequired
  },
  render: function () {
    props = this.props;

    return (
      <g>
        <Line source={props.source.centerPosition}
              target={props.target.centerPosition}/>
      </g>
    );
  }
});

module.exports = Link;
