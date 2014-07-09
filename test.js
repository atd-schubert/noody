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
    if(err) return console.log("Error: ", err);
    
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
          if(err) return console.log("Error: ", err);
          console.log(""); console.log(""); console.log("");
          
          console.log("Our two nodes: ", node.stringify(null, 2), childNode.stringify(null, 2));
          
          // Now let's populate as tree
          childNode.delete(function(err){
            if(err) return console.log("Error: ", err);
            datastore.populate(node, function(err, node){
              if(err) return console.log("Error: ", err);
              
              console.log(""); console.log(""); console.log("");
              
              console.log("The populated node: ", node.stringify(null, 2));
  
            });
            
          });
          
          
        });
    });
  });
  
});