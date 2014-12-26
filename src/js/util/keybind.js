/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

var Mousetrap = require("mousetrap"),

    //globals
    configuration = {
      "addNode": {
        key: "n",
        defaultFunc: function () {}
      },
      "addLink": {
        key: "l",
        defaultFunc: function () {}
      },
      "default": {
        key: "esc",
        defaultFunc: function () {

        }
      }
    };


var keybind = {
    bind: function (keyName, func) {
      var config = configuration[keyName];
      if (!config) {
        throw new Error("keyName not found.");
      }
      Mousetrap.bind(config.key, func, config.mode);
    }
};

//default keybinding configuration
Object.keys(configuration).forEach(function (keyName) {
    var config = configuration[keyName];
    if (config.defaultFunc) {
      keybind.bind(keyName, config.defaultFunc);
    }
});

module.exports = keybind;
