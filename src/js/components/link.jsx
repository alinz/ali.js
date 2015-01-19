/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React       = require("react"),

    //util
    Vector2D    = require("./../util/math/vector2d.js"),
    Physics     = require("./../util/math/physics.js"),

    //classes
    NodeClass   = require("./../node.js"),
    LinkClass   = require("./../link.js"),

    //components
    Line        = require("./line.jsx"),

    //globals
    angle       = 0,
    tempVector  = new Vector2D(),
    props,

    cosAngle    = 0,
    sinAngle    = 0,
    absCosAngle = 0,
    absSinAngle = 0,
    width       = 0,
    height      = 0,
    magnitude   = 0,

    fromVector  = new Vector2D(),
    toVector    = new Vector2D();

var Link = React.createClass({
  propTypes: {
    objRef: React.PropTypes.instanceOf(LinkClass).isRequired,
    source: React.PropTypes.instanceOf(NodeClass).isRequired,
    target: React.PropTypes.instanceOf(NodeClass).isRequired
  },
  _calculateIntersectPoint: function (angle, constObj, ref) {
    cosAngle    = Math.cos(angle);
    sinAngle    = Math.sin(angle);
    absCosAngle = Math.abs(cosAngle);
    absSinAngle = Math.abs(sinAngle);
    width       = constObj.size.x;
    height      = constObj.size.y;

    magnitude   = (width / 2 * absSinAngle <= height / 2 * absCosAngle)?
                        width / 2 / absCosAngle :
                        height / 2 / absSinAngle;

    ref.x       = constObj.centerPosition.x - cosAngle * magnitude;
    ref.y       = constObj.centerPosition.y - sinAngle * magnitude;
  },
  getInitialState: function () {
    return {
        source: new Vector2D(),
        target: new Vector2D()
    };
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (!this.state.source.equal(nextProps.source.position) ||
        !this.state.target.equal(nextProps.target.position)) {
      this.state.source.copyFrom(nextProps.source.position);
      this.state.target.copyFrom(nextProps.target.position);

      return true;
    }

    return false;
  },
  render: function () {
    props = this.props;

    //check if both boxes are intersect with each other
    //if they are colliding, we don't need to render the line
    if (Physics.collision.boundingBox(props.source.centerPosition,
                                      props.source.size,
                                      props.target.centerPosition,
                                      props.target.size)) {

      //rendering a null instead of react object cause react to not render that
      //object.
      return null;
    }

    angle = tempVector.copyFrom(props.source.position)
                      .sub(props.target.position)
                      .angleRadian();

    this._calculateIntersectPoint(angle, props.source, fromVector);
    this._calculateIntersectPoint(angle + Math.PI, props.target, toVector);

    return (
      <g>
        <Line source={fromVector}
              target={toVector}/>

        <circle cx={fromVector.x}
                cy={fromVector.y}
                r={5}
                className="fill-black"/>

        <circle cx={toVector.x}
                cy={toVector.y}
                r={5}
                className="fill-white boarder-black"/>

        <circle cx={toVector.x}
                cy={toVector.y}
                r={3}
                className="fill-black"/>
      </g>
    );
  }
});

module.exports = Link;
