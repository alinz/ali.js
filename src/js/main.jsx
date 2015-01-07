/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var React                     = require("react"),

    Mode                      = require("./constant.js").Mode,

    //base class for scene managment
    SceneBaseClass            = require("./scene.js"),

    //Components
    SceneReact                = require("./components/scene.jsx"),

    //util
    generator                 = require("./util/generator.js"),

    //globals
    VERSION                   = "alpha-0.0.1",

    Ali                       = {},
    shouldMethodsToOverride   = [ "getNodesDefinition",
                                  "getLinksDefinition" ],
    illegalMethodsToOverride  = [ "mode",
                                  "import",
                                  "export",
                                  "setCursor" ];

Ali.version = VERSION;

Ali.createScene = function (definition) {
  function SceneExtend() {
    SceneBaseClass.call(this);
  }

  SceneExtend.prototype = Object.create(SceneBaseClass);
  SceneExtend.prototype.constructor = SceneExtend;

  //these methods should be overridden
  shouldMethodsToOverride.forEach(function (methodName) {
    if (!definition.hasOwnProperty(methodName)) {
      throw "'" + methodName + "' method needs to be defined";
    }
  });

  //these methods should not be overridden.
  illegalMethodsToOverride.forEach(function (methodName) {
    if (definition.hasOwnProperty(methodName)) {
      throw "'" + methodName + "' is a reserved method.";
    }
  });

  Object.keys(definition).forEach(function (methodName) {
    SceneExtend.prototype[methodName] = definition[methodName];
  });

  return SceneExtend;
};

Ali.attach = function (SceneExtendedClass, domElement) {
  var sceneObj;

  if (!SceneExtendedClass instanceof SceneBaseClass) {
    throw "Scene class implementation is not created by createScene method.";
  }

  sceneObj = new SceneExtendedClass();
  sceneObj.renderedSceneObj = React.render(
    <SceneReact data={sceneObj.data}/>,
    domElement
  );
};

Ali.Mode = Mode;

module.exports = Ali;

//make the framework available to global scope
if (window) {
  window.Ali = Ali;
}
