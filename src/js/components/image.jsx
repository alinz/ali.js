/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React           = require("react"),

    //utils
    generator       = require("./../util/generator.js"),

    //math
    Vector2D        = require("./../util/math/vector2d.js"),

    //global variables
    imageFragments  = [           //index value
      '<image x="',                 //0
      100,                          //1   position.x
      '" y="',                      //2
      100,                          //3   position.y
      '" width="',                  //4
      100,                          //5   size.x
      '" height="',                 //6
      100,                          //7   size.y
      '" xlink:href="',             //8
      "",                           //9   href
      '" fill="#90" stroke="#000"'  //10
    ];


function prepareImage(position, size, href) {
  imageFragments[1] = position.x;
  imageFragments[3] = position.y;
  imageFragments[5] = size.x;
  imageFragments[7] = size.y
  imageFragments[9] = href;

  return imageFragments.join("");
}

var Image = React.createClass({
  propTypes: {
    position: React.PropTypes.instanceOf(Vector2D).isRequired,
    size: React.PropTypes.instanceOf(Vector2D).isRequired,
    href: React.PropTypes.string.isRequired
  },
  render: function () {
    var props = this.props,
        html = prepareImage(props.position, props.size, props.href),

        //we need to generate new id everytime we render this component.
        //if we don't react internal will not render the image.
        id = "image:" + generator.genId();

    return (
      <g key={id} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
});

module.exports = Image;
