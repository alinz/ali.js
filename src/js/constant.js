/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var genId = require("./util/generator.js").genId;

function Constant() { }

//defines 3 different modes
Constant.Mode_Default   = genId();
Constant.Mode_Node      = genId();
Constant.Mode_Link      = genId();

module.exports = Constant;
