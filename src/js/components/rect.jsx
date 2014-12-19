"use strict";

var React = require("react");

var Rect = React.createClass({
  mixins: [],
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired
  },
  shouldComponentUpdate: function (nextProps) {
    return (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height ||
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y
    );
  },
  render: function () {
    return (
      <rect className="rect"
            x={this.props.x}
            y={this.props.y}
            width={this.props.width}
            height={this.props.height}/>
    );
  }
});

module.exports = Rect;
