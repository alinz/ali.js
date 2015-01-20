# Ali

Visual and Interactive Framework for Node base.

## Usage

`ali.js` is a framework on top of React.js which enables application to be
configure interactively.

the basic setup is as simple as 3 steps:

1.include ali.js

```js
<script src="ali.js"></script>
```

2.create a scene

```js
<script>

var myScene = Ali.createScene({
  //...
});

</script>
```

3.attach the scen object to a dom element.

```js
Ali.attach(myScene, document.getElement("my-scene"));
```

After these steps, you will see an empty page. `Scene` is created but there is
nothing to be shown yet. It is a time to learn about `Scene` object.

### Scene

A `Scene` object must be created by `Ali.createScene`. `createScene` is a helper
function which make sure that requested scene follows some rules. For example,
some of the methods are required to be overriden and some are optional. In this
section, we are going to talk about it in depth.

### Methods

> NOTE: `ali.js` is in active development and apis are subject to change.


#### getNodesDefinition()

#### getLinksDefinition()

#### sceneReady()

#### sceneWillCreateNode(`node`, `proceed`, `stop`)

#### sceneDidCreateNode(`node`)

#### sceneWillConnectNodes(`sourceNode`, `targetNode`, `link`, `proceed`, `stop`)

#### sceneDidConnectNodes(`sourceNode`, `targetNode`, `link`)

#### setMode(`mode`)

#### setNodeType(`nodeType`)

#### setLinkType(`linkType`)

#### import(`data`)

#### export()
