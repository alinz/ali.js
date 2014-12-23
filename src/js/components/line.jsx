/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React             = require("react"),

    //util
    Vector2D          = require("./../util/math/vector2d.js"),

    //globals
    lineConfiguration = [
      "M",
      0, 0, // 1, 2 sourceX, sourceY
      "C",
      0, 0, // 4, 5 c1X, c1Y
      0, 0, // 6, 7 c2X, c2Y
      0, 0  // 8, 9 targetX, targetY
    ],
    props,

    //curv variables
    min = new Vector2D(),
    max = new Vector2D();

var Line = React.createClass({
  propTypes: {
    source: React.PropTypes.instanceOf(Vector2D).isRequired,
    target: React.PropTypes.instanceOf(Vector2D).isRequired
  },
  getInitialState: function () {
      return {
        source: new Vector2D(),
        target: new Vector2D()
      };
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (!this.state.source.equal(nextProps.source) ||
        !this.state.target.equal(nextProps.target)) {

      this.state.source.copyFrom(nextProps.source);
      this.state.target.copyFrom(nextProps.target);

      return true;
    }

    return false;
  },
  curv: function () {
    //this method is not working yet.
    props = this.props;

    min.x = props.source.x;
    min.y = props.source.y;

    max.copyFrom(min);
       //.add(props.size);

    if (props.source.y > min.y &&
        props.source.y < max.y &&
        (props.source.x > min.x || props.source.x < max.x)) {
      lineConfiguration[4] = props.source.x + (props.target.x - min.x) / 2;
      lineConfiguration[5] = props.source.y;
      lineConfiguration[6] = lineConfiguration[4];
      lineConfiguration[7] = props.target.y;
    } else {
      lineConfiguration[4] = props.source.x;
      lineConfiguration[5] = props.source.y + (props.target.y - props.source.y) / 2;
      lineConfiguration[6] = props.target.x;
      lineConfiguration[7] = lineConfiguration[5];
    }
  },
  straight: function () {
    props = this.props;

    lineConfiguration[1] = props.source.x;
    lineConfiguration[2] = props.source.y;

    lineConfiguration[4] = props.source.x;
    lineConfiguration[5] = props.source.y;

    lineConfiguration[6] = props.target.x;
    lineConfiguration[7] = props.target.y;

    lineConfiguration[8] = props.target.x;
    lineConfiguration[9] = props.target.y;
  },
  render: function () {
    this.straight();
    //this.curv();

    return (
      <g className="line">
        <path className="line-bg" d={lineConfiguration.join(" ")}></path>
      </g>
    );
  }
});

module.exports = Line;
