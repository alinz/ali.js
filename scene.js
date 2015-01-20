"use strict";

Ali.attach(Ali.createScene({
  getNodesDefinition: function () {
    return nodeTypes;
  },
  getLinksDefinition: function () {
    return linkTypes;
  },
  sceneReady: function () {
    console.log("Scene is Ready");
    this.setMode(Ali.Constant.Mode_Node);
    this.setNodeType("RabbitMQ");


    setTimeout(function () {
      this.setMode(Ali.Constant.Mode_Link);
      this.setLinkType("TCP");

      console.log("LINK MODE");
    }.bind(this), 4000);

    setTimeout(function () {
      this.setMode(Ali.Constant.Mode_Default);

      console.log("DEFAULT MODE");
    }.bind(this), 8000);
  },
  sceneWillCreateNode: function (node, proceed, stop) {
    proceed();
  },
  sceneDidCreateNode: function (node) {

  },
  sceneWillConnectNodes: function (sourceNode, targetNode, link, proceed, stop) {
    proceed();
  },
  sceneDidConnectNodes: function (sourceNode, targetNode, link) {

  },
  sceneDidRequestNodeInfo: function (node) {

  },
  sceneDidRequestLinkInfo: function (link) {

  }
}), document.getElementById("content"));
