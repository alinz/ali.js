"use strict";

var React = require("react");

var Label = React.createClass({
  mixins: [],
  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    value: React.PropTypes.string.isRequired
  },
  shouldComponentUpdate: function (nextProps) {
    return nextProps.x !== this.props.x ||
           nextProps.y !== this.props.y ||
           nextProps.value !== this.props.value;
  },
  getBBox: function () {
    return this.getDOMNode().getBBox();
  },
  render: function () {
    return (
      <text x={this.props.x} y={this.props.y}>{this.props.value}</text>
    );
  }
});

module.exports = Label;
