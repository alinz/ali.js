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

    //Components
    Scene       = require("./components/scene.jsx"),

    //util
    generator   = require("./util/generator.js");

var VERSION = "alpha-v0.1";

function call(callback, event) {
  if ("function" === typeof callback) {
    callback(event);
  }
}

function checkObj(obj, type, target) {
  //checking required fields:
  if ("string" !== typeof obj.name) {
    throw "a '" + type + "' defines without name.";
  }

  if ("object" !== typeof obj.meta) {
    throw "a '" + type + "' defines without meta.";
  }

  if ("object" !== typeof obj.attributes) {
    throw "a '" + type + "' defines without attributes.";
  }

  //checking duplicate nodes
  if (target[obj.name]) {
    throw type + " with '" + node.name + "' already exists."
  }

  target[obj.name] = obj;
}

function Ali() {
  this.eventMap = {};
  this.nodeType = {};
  this.linkType = {};
}

Ali.prototype.defineNodes = function (nodes) {
  nodes.forEach(function (node) {
    checkObj(node, "node", this.nodeType);
  }.bind(this));
  return this;
};

Ali.prototype.defineLinks = function (links) {
  links.forEach(function (link) {
    checkObj(link, "link", this.linkType);
  }.bind(this));
  return this;
};

Ali.prototype.on = function (eventType, callback) {
  this.eventMap[eventType] = callback;
  return this;
};

Ali.prototype.save = function () {
  call(this.eventMap[Ali.onSave], data);
  return this;
};

Ali.prototype.load = function (data) {
  call(this.eventMap[Ali.onLoad], data);
  return this;
};

Ali.prototype.mode = function (mode) {
  this.mode = mode;
  call(this.eventMap[mode]);
  return this;
};

Ali.prototype.setNodeType = function (nodeType) {

};

Ali.prototype.setLinkType = function (linkType) {

};

Ali.prototype.attach = function (domElement) {
  var data = { nodes: [], links: [] };

  React.render(
    <Scene source={data}/>,
    domElement
  );

  return this;
};

Ali.Version = VERSION;

Ali.Event = {
  onModeChanged:          generator.genId(),

  onNodeDoubleClick:      generator.genId(),
  onNodeClick:            generator.genId(),

  onLinkDoubleClick:      generator.genId(),
  onLinkClick:            generator.genId(),

  onNodeBeforeAdd:        generator.genId(),
  onNodeAdded:            generator.genId(),
  onNodeRemoved:          generator.genId(),
  onLinkAdded:            generator.genId(),
  onLinkRemoved:          generator.genId(),

  onLoad:                 generator.genId(),
  onSave:                 generator.genId()
};

Ali.Mode = {
  Default:                generator.genId(),
  AddNode:                generator.genId(),
  AddLink:                generator.genId()
};

Ali.create = function () {
  return new Ali();
};

module.exports = Ali;

//make the framework vailable to global scope
if (window) {
  window.Ali = Ali;
}

/*
var myObj = ali.create();

myObj.defineNodes(
      [
        {
          name: "RabbitMQ",
          meta: {
            icon: "./../img/rabbitMQ.png",
            style: [],  //all the items in style attribute are string and connect to a style css
          },
          attributes: {

          }
        }
      ]
     )
     .defineLinks([])
     .on("onNodeDoubleClick", function (event) { })
     .on("onNodeClick", function (event) { })
     .on("onLinkDoubleClick", function (event) { })
     .on("onLinkClick", function (event) { })
     .on("onNodeAdd", function (event) { })
     .on("onNodeRemove", function (event) { })
     .on("onNodeLink", function (event) { })
     .on("onLinkAdd", function (event) { })
     .on("onLinkRemove", function (event) { })

     //By using this method,
     //default: zoom+panning+dragging

     .mode("default")
     .attach(domObj);
*/
