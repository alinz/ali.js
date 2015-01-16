"use strict";

Ali.attach(Ali.createScene({
  getNodesDefinition: function () {
    return nodeTypes;
  },
  getLinksDefinition: function () {
    return linkTypes;
  },
  sceneDidReady: function () {
    console.log("Scene is Ready");
    this.setMode(Ali.Constant.Mode_Node);
    this.setNodeType("RabbitMQ");
  },
  sceneWillCreateNode: function (node, proceed, stop) {
    //proceed();
  },
  sceneDidCreateNode: function (node) {

  },
  sceneWillConnectNodes: function (nodeA, nodeB, link, proceed, stop) {
    //proceed();
  },
  sceneDidConnectNodes: function (nodeA, nodeB, link) {

  },
  sceneDidRequestNodeInfo: function (node) {

  },
  sceneDidRequestLinkInfo: function (link) {

  }
}), document.getElementById("content"));
