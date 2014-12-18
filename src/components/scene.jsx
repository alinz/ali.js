var React = require("react"),
    AnimationFrameMixin = require("./../mixins/animation-frame.js"),
    TouchUtilMixin = require("./../mixins/touch-util.js");

var Scene = React.createClass({
  mixins: [AnimationFrameMixin, TouchUtilMixin],
  render: function () {
    return (
      <p>Hello World this is scene!</p>
    );
  }
});

module.exports = Scene;
