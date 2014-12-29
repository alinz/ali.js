/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

var Mousetrap = require("mousetrap"),

    //global
    KeyConstant = {
      Default:  0,
      AddNode:  1,
      AddLink:  2,
      Save:     3
    },
    KeyMap = {},

    currentState = KeyConstant.Default,

    keybind = {
        constant: KeyConstant,
        getCurrentState: function (state) {
          return currentState;
        },
        __getKey: function (state) {
          var key = KeyMap[state];
          if (typeof key === "undefined") {
            throw new Error("key state is wrong.");
          }

          return key;
        },
        bind: function (state, func) {
          var key = this.__getKey(state);
          Mousetrap.bind(key, function (event) {
            currentState = state;
            func(event);
          });
        },
        trigger: function (state) {
          var key = this.__getKey(state);
          Mousetrap.trigger(key);
        }
    };

KeyMap[KeyConstant.Default]   = "esc";
KeyMap[KeyConstant.AddNode]   = "n";
KeyMap[KeyConstant.AddLink]   = "l";
KeyMap[KeyConstant.Save]      = "mod+s";

module.exports = keybind;
