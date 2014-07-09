# Noody

## Description

This is a module to support nodes with child nodes, inspired by the document object model.

A node only have these objects:
* `_id`: Internal ID, for example served by Mongoose.ObjectId
* `id`: The optional, but unique id String in the whole dataset
* `class`: This is something like hashtags or the classes-attributes in DOM.
* `name`: The type of a node. This should give the connection to the way how process the data. 
* `data`: This is the data of a node. The data is structured like JSON, so it is possible to save strings, nested arrays and objects and numbers, but no functions!
* `childNodes`: An array of node-private-ids (_id) connected under this node in the hierarchy.

You are able to resolve node-trees completely with Tree(node) in a JSON-like representation of the tree, but you are only allowed to change data in a node-object. A tree replace an object with all described methods of the node object for the _id in childNodes.

This module should be able to use implement different stores: virtual, mongoose, redis...

## Installation

At this time you have to clone this module from repo or download the code on github, go to the project folder and run `npm install`

## How to use

```
"use strict";

var Noody = require("./index");
var datastore = new Noody({store: new Noody.Stores.virtual()}); // the parameter is optional and defaults to virtual store. Please look at stores section for further informations

// Let's create the first node
datastore.createNode({
  data: {your:"JSON", data:"here"},
  class: "classes like in html",
  id: "thisHaveToBeUnique-orNull",
  name: "name-of-the-node"
}, function(err, node){
  if(err) return console.log("Error: ", err);
  console.log("Here is your node", node.stringify(null, 2));
  
  // Let's change the content:
  
  node.data.additional = "Something new in this data-table";
  
  console.log(""); console.log(""); console.log("");
  
  console.log("Node with changed content", node.stringify(null, 2));
  
  node.setData() // to notify we made changes...
    .setName("root")
  
  // Now save the changes
  
    .save(function(err, node){
    if(err) console.log(err);
    
    console.log(""); console.log(""); console.log("");
    console.log("Our changed node:", node.stringify(null, 2));
    
    
    // Let's create a child node and connect it with the root node
    
    datastore.createNode({
      data: {
        text: "this is the child node."
      },
      name: "child"
    }, function(err, childNode){
      node.appendChild(childNode._id) // you don't have to use ._id, but it will be saved this way...
        .appendChild(childNode)       // Take a look, it works...
        .save(function(err, node){
          console.log(""); console.log(""); console.log("");
          
          console.log("Our two nodes: ", node.stringify(null, 2), childNode.stringify(null, 2));
        });
    });
  });
  
});

```

## Stores
### Virtual
This store is a lightweight mem-cached version and should not be used in production modus!

## Roadmap
### Milestones
The milestones are orderd to their piority

#### Basic node-system with virtual store
The node object should work with a local, virtual store.

#### Populate with tree
The tree object should be able to resolve a node like described above.

#### Mongoose as store
Implement the ability to set a store and implement a strategy for mongoose.

#### Schemas and validation
Implement the ability to use schemas and validations for a node.