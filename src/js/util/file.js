/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var document = window.document;

module.exports = {
  //all the variables are required.
  saveAs: function (filename, data, type) {
    var aTag = document.createElement("a");
    aTag.href = window.URL.createObjectURL(new Blob([data], { type: type }));
    aTag.download = filename;

    document.body.appendChild(aTag);
    aTag.click();

    document.body.removeChild(aTag);
  }
};
