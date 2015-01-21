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

    document.body.addEventListener("keydown", function(evt) {
      switch(evt.keyCode) {
        case 78:
          this.setMode(Ali.Constant.Mode_Node);
          this.setNodeType("RabbitMQ");
          break;
        case 27:
          this.setMode(Ali.Constant.Mode_Default);
          break;
        case 76:
          this.setMode(Ali.Constant.Mode_Link);
          this.setLinkType("TCP");
          break;
      }
    }.bind(this), false);
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
