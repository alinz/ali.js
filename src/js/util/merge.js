/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var key;

module.exports = {
  object: function (target, source, filter) {
    for (key in source) {
      if ("function" !== typeof filter || filter(key, source[key])) {
        target[key] = source[key];
      }
    };
  }
};
