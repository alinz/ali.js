/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var textLengthMap = {},
    tempValue;


module.exports = {
  /*
    this function returns width and height of string in element.
    returns {
      width: <number>,
      height: <number>
    }
   */
  getTextLength: (function () {
    var elemDiv = document.createElement('div');

    elemDiv.style.cssText = 'visibility:hidden;position:absolute;z-index:0;';
    document.body.appendChild(elemDiv);

    return function (str) {
      tempValue = textLengthMap[str];
      if ("undefined" === typeof tempValue) {
        elemDiv.innerHTML = str;
        tempValue = {
          width: elemDiv.offsetWidth,
          height: elemDiv.offsetHeight
        };
        textLengthMap[str] = tempValue;
      }
      return tempValue;
    };
  }())
};
