/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

module.exports = {
  object: function (target, source, filter) {
    Object.keys(source).forEach(function (key) {
      if ("function" === typeof filter && !filter(key, source[key])) {
        return;
      }
      target[key] = source[key];
    });
  }
};
