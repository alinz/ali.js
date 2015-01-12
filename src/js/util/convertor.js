/**
* Copyright 2014, Ali Najafizadeh.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*
*/

"use strict";

var generator = require("./generator.js");

module.exports = {
  jsonToAli: function (data) {
    var result = { nodes: {}, links: [] },
        linkObj,
        nodeObj,
        tempId,
        tempSource,
        tempTarget;

    //we need to generate id per load. as an example,
    //if some node generated and deleted, the ranaming id can
    //be overriden by new node. So by having a a convertorMap,
    //we can generate id per load.
    var mapId = {};

    data.nodes.forEach(function (node) {
      tempId = generator.genNodeId();
      mapId[node.id] = tempId;

      result.nodes[tempId] = {
        id: tempId,
        data: node.data,
        position: new Vector2D(node.position.x, node.position.y)
      }
    });

    data.links.forEach(function (link) {
      tempSource = mapId[link.source];
      tempTarget = mapId[link.target];

      linkObj = {
        id: generator.genLinkId(),
        source: tempSource,
        target: tempTarget,
        data: link.data
      };

      nodeObj = result.nodes[tempSource];

      if (!nodeObj) {
        throw "a link tries to connect to a non-exists node.";
      }

      result.links.push(linkObj);
    });

    return result;
  },
  aliToJson: function () {

  }
};
