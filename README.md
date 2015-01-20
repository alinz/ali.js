# @li.js

Visual and Interactive Framework using Node base design.

## Usage

`@li.js` is a framework on top of `React.js` which enables application to be
configure interactively.

the basic setup is as simple as 3 steps:

1.include @li.js

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

## Scene

A `Scene` object must be created by `Ali.createScene`. `createScene` is a helper
function which make sure that requested scene follows some rules. For example,
some of the methods are required to be overriden and some are optional. In this
section, we are going to talk about it in depth.

## Methods

> NOTE: `ali.js` is in active development and apis are subject to change.


#### getNodesDefinition()

`Must Override`

#### getLinksDefinition()

`Must Override`

#### sceneReady()

`Optional to Override`

#### sceneWillCreateNode(`node`, `proceed`, `stop`)

`Optional to Override`

#### sceneDidCreateNode(`node`)

`Optional to Override`

#### sceneWillConnectNodes(`nodeA`, `nodeB`, `link`, `proceed`, `stop`)

`Optional to Override`

#### sceneDidConnectNodes(`nodeA`, `nodeB`, `link`)

`Optional to Override`

#### setMode(`mode`)

`Must not Override`

#### setNodeType(`nodeType`)

`Must not Override`

#### setLinkType(`linkType`)

`Must not Override`

#### import(`data`)

`Must not Override`

#### export()

`Must not Override`

## Properties

#### Node

TBA

#### Link

TBA

#### Mode

Modes are constant values which indicate the state of `Scene`. There are **3**
modes available.

* `Ali.Constant.Mode_Default` put `Scene` in panning and zooming mode
* `Ali.Constant.Mode_Node` put `Scene` in adding node
* `Ali.Constant.Mode_Link` put `Scene` in adding link between nodes
