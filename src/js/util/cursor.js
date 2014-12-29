/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";


var body = document.body,

    //add values to each classes
    cursorClasses = {
      Default:    "",
      OpenHand:   "cursor-open-hand",
      ClosedHand: "cursor-closed-hand",
      Pointer:    "cursor-pointer"
    };

function changeClassIfNot(value) {
  if (body.className !== value) {
    body.className = value;
  }
}

module.exports = {
  //pointer to each values
  classes: cursorClasses,
  //apply the cursor class at the body level (global)
  set: changeClassIfNot
};
