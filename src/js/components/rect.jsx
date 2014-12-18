"use strict";

var React = require("react"),
    EventEmitterMixin = require("./../mixins/event-emitter.js");

var Rect = React.createClass({
  mixins: [EventEmitterMixin],
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  },
  shouldComponentUpdate: function (nextProps) {
    return (
      nextProps.width !== this.props.width ||
      nextProps.height !== this.props.height
    );
  },
  render: function () {
    return (
      <rect className="rect"
            width={this.props.width}
            height={this.props.height}/>
    );
  }
});

module.exports = Rect;
