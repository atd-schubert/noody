"use strict";

var Noody = require("../");


describe('Virtual-Store', function(){

  var datastore = new Noody();
  var firstNode, nodeWithChild;

  describe('#createNode()', function(){
    it('should create a new element', function(done){
      datastore.createNode({name:"test", data:{message:"Some data..."}}, function(err, node){
        firstNode = node;
        done(err, node);
      });
    });
    it('should create a new element with the correct data', function(done){
      datastore.createNode({id: "full", name:"another", data:{message:"Some data..."}, class:"example", childNodes: [firstNode]}, function(err, node){
        nodeWithChild = node;
        if(node.data.message === "Some data..." && node.id === "full" && node.class === "example" && node.name === "another" && node.childNodes[0]=== firstNode._id) done(err, node);
        else done(new Error("Invalid data"));
      });
    });
    
    it('should not create a node without name', function(done){
      datastore.createNode({data:{message:"Some data..."}, class:"example"}, function(err, node){
        if(err) done();
        else done(new Error("Havn't make an error during creating a node without name!"));
        //else done(new Error("Invalid data"));
      });
    });
  });
  describe('#getNode()', function(){
    it('should get our first node from test', function(done){
      datastore.getNode(firstNode._id, done);
    });
  });
  describe('#populate()', function(){
    it('should populate node', function(done){
      datastore.populate(nodeWithChild, done);
    });
    it('should get data of populated child', function(done){
      if(nodeWithChild.childNodes[0].data.message === firstNode.data.message) done();
      else done(new Error("The populated child havn't the right data"));
    });
  });
  describe('#deleteNode()', function(){
    var nodeToDelete;
    
    it('should delete a node', function(done){
      datastore.createNode({name:"tmp"}, function(err, node){
        nodeToDelete = node;
        
        node.delete(done);
        
      });
    });
    it('should find deleted node, but set it to name "deleted"', function(done){
      datastore.getNode(nodeToDelete._id, function(err, node){
        if(err) done(err);
        if(node.name === "deleted") return done();
        done(new Error("node isn't marked as deleted"));
      });
    });
  });
  describe('change Node', function(){
    
    it('should not save untracked changed data', function(done){
      datastore.getNode(nodeWithChild._id, function(err, node){
        if(err) return done(err);
        node.class = "wrong";
        node.id = "wrong";
        
        node.save(function(err){
          datastore.getNode(node._id, function(err, node){
            if(err) return done(err);
            if(node.class !== "wrong") done();
            else done(new Error("saved untracked data"));
          });
        });
      });
    });
    
    it('should save changed node', function(done){
      firstNode
        .setName("different")
        .setClass("class")
        .setData({message: "new data"})
        .save(done);
    });
    it('should have saved changed data', function(done){
      datastore.getNode(firstNode._id, function(err, node){
        if(err) return done(err);
        if(node.name === "different" && node.class === "class" && node.data.message === "new data") done();
        else done(new Error("Not saved correctly"));
      });
    });
  });
  describe('ids in nodes', function(){
    
    it('should have saved id data', function(done){
      datastore.getNode(firstNode._id, function(err, node){
        if(err) return done(err);
        node.setId("myNode").save(function(err, node){
          if(err) return done(err);
          //datastore.getNode(firstNode._id, function(err, node){
            if(err) return done(err);
            if(node.id === "myNode") done();
            else done(new Error("Not the right id"));
          //};
        });
      });
    });
    it('should have saved id as a string', function(done){
      datastore.getNode(nodeWithChild._id, function(err, node){
        if(err) return done(err);
        node.setId(1).save(function(err, nodeTmp){
          if(err) return done(err);
          //datastore.getNode(firstNode._id, function(err, node){
            if(err) return done(err);
            if(node.id === "1") done();
            else done(new Error("Not the right id"));
          //};
        });
      });
    });
    it('should have saved id data', function(done){
      datastore.getNode(firstNode._id, function(err, node){
        if(err) return done(err);
        node.setId("myNode").save(function(err, node){
          if(err) return done(err);
          //datastore.getNode(firstNode._id, function(err, node){
            if(err) return done(err);
            if(node.id === "myNode") done();
            else done(new Error("Not the right id"));
          //};
        });
      });
    });
    it('should not be able to create a node with an existing id', function(done){
      datastore.createNode({id:"myNode", name:"sameid"}, function(err, node){
        if(err) return done(null, err);
        if(node.id === "myNode") return done(new Error("Node was created"));
        done(new Error("No exception"));
        
      });
    });
    it('should not saved with same id', function(done){
      datastore.getNode(nodeWithChild._id, function(err, node){
        return done(err);
        if(err) return done(err);
        if(node.id === "myNode") done();
        else done(new Error(""));
      });
    });
  });
  
  describe('JSON-Schema for data', function(){
    // get schema here: http://www.jsonschema.net/
    var schema = {"type":"object","$schema": "http://json-schema.org/draft-03/schema","id": "http://jsonschema.net","required":false,"properties":{ "arr": { "type":"array", "description": "An array with at least 1 but maximum 3 items, but it is nor required!", "minitems": "1", "maxitems": "3", "required":false}, "number": { "type":"number", "required":false }, "pattern": { "pattern":"^Hallo", "type":"string", "description": "A field witch validates with regex", "required":false }, "req": { "type":"string", "name": "required", "description": "A required field for test", "id": "http://jsonschema.net/req", "required":true } }};
    var schemaNode;
    
    datastore.setSchema("schema", schema);
    
    it("schould create a node with valid data", function(done){
      datastore.createNode({name:"schema", data:{pattern:"Hallo Word", req: "Here it is", number: 123, arr:[1,2]}}, function(err, node){
        if(err) return done(err);
        schemaNode = node;
        if(node.data.req === "Here it is") done();
        else done(new Error("Created node is not the right one..."));
      });
    });
    it("schould not create a node with invalid data", function(done){
      datastore.createNode({name:"schema", data:{pattern:"Hello Word", number: "is an Int", arr:[1,2,3,4]}}, function(err, node){
        if(err) done();
        else done(new Error("created a node with invalid data"));
      });
    });
    it("schould not setdata to a node with invalid data", function(done){
      try {
        schemaNode.setData({});
      } catch(e) { return done(); }
      done(new Error("changed data"));
    });
    
  });
  
  
  
  
  describe('stress tests', function(){
    return;
    describe("create 1000000 nodes", function(done){
      it("should create such a mass elements", function(done){
        var total = 1000000;
        var ready = 0;
        var i = 0;
        
        var backcount = function(){
          if(++ready === total) done();
        };
        
        for(i=0; i<total; i++) {
          datastore.createNode({data: {no:"data"}, class: "one-in-a-million", id:"stress1-"+i, name:"stress"}, function(err, node){
            if(err) return done(err);
            if(!node.class === "one-in-a-million" || !node.data.no === "data" ) return done(new Error("Wrong data in stresstest"));
            else backcount();
          });
        }
      });
      
      
      it("should get all elements by id", function(done){
        var total = 1000000;
        var ready = 0;
        var i = 0;
        
        var backcount = function(){
          if(++ready === total) done();
        };
        
        for(i=0; i<total; i++) {
          datastore.getNodeById("stress1-"+i, function(err, node){
            if(err) return done(err);
            if(!node.class === "one-in-a-million" || !node.data.no === "data" ) return done(new Error("Wrong data in stresstest"));
            else backcount();
          });
        }
      });
      
    });
  });
});


describe('Mongoose-Store', function(){

  try {
    var mongoose = require("mongoose");
    mongoose.connect('mongodb://localhost/_noody-test');
  } catch (e){
    console.log("\n\nCan't run test with mongoose, because:");
    return console.log(e);
  }
  var datastore = new Noody(Noody.Stores.mongoose({mongoose: mongoose}));
  var firstNode, nodeWithChild;

  describe('#createNode()', function(){
    it('should create a new element', function(done){
      datastore.createNode({name:"test", data:{message:"Some data..."}}, function(err, node){
        firstNode = node;
        done(err, node);
      });
    });
    it('should create a new element with the correct data', function(done){
      datastore.createNode({id: "full", name:"another", data:{message:"Some data..."}, class:"example", childNodes: [firstNode]}, function(err, node){
        nodeWithChild = node;
        if(node.data.message === "Some data..." && node.id === "full" && node.class === "example" && node.name === "another" && node.childNodes[0]=== firstNode._id) done(err, node);
        else done(new Error("Invalid data"));
      });
    });
    
    it('should not create a node without name', function(done){
      datastore.createNode({data:{message:"Some data..."}, class:"example"}, function(err, node){
        if(err) done();
        else done(new Error("Havn't make an error during creating a node without name!"));
        //else done(new Error("Invalid data"));
      });
    });
  });
  describe('#getNode()', function(){
    it('should get our first node from test', function(done){
      datastore.getNode(firstNode._id, done);
    });
  });
  describe('#populate()', function(){
    it('should populate node', function(done){
      datastore.populate(nodeWithChild, done);
    });
    it('should get data of populated child', function(done){
      if(nodeWithChild.childNodes[0].data.message === firstNode.data.message) done();
      else done(new Error("The populated child havn't the right data"));
    });
  });
  describe('#deleteNode()', function(){
    var nodeToDelete;
    
    it('should delete a node', function(done){
      datastore.createNode({name:"tmp"}, function(err, node){
        nodeToDelete = node;
        
        node.delete(done);
        
      });
    });
    it('should find deleted node, but set it to name "deleted"', function(done){
      datastore.getNode(nodeToDelete._id, function(err, node){
        if(err) done(err);
        if(node.name === "deleted") return done();
        done(new Error("node isn't marked as deleted"));
      });
    });
  });
  describe('change Node', function(){
    
    it('should not save untracked changed data', function(done){
      datastore.getNode(nodeWithChild._id, function(err, node){
        if(err) return done(err);
        node.class = "wrong";
        node.id = "wrong";
        
        node.save(function(err){
          datastore.getNode(node._id, function(err, node){
            if(err) return done(err);
            if(node.class !== "wrong") done();
            else done(new Error("saved untracked data"));
          });
        });
      });
    });
    
    it('should save changed node', function(done){
      firstNode
        .setName("different")
        .setClass("class")
        .setData({message: "new data"})
        .save(done);
    });
    it('should have saved changed data', function(done){
      datastore.getNode(firstNode._id, function(err, node){
        if(err) return done(err);
        if(node.name === "different" && node.class === "class" && node.data.message === "new data") done();
        else done(new Error("Not saved correctly"));
      });
    });
  });
  describe('ids in nodes', function(){
    
    it('should have saved id data', function(done){
      datastore.getNode(firstNode._id, function(err, node){
        if(err) return done(err);
        node.setId("myNode").save(function(err, node){
          if(err) return done(err);
          //datastore.getNode(firstNode._id, function(err, node){
            if(err) return done(err);
            if(node.id === "myNode") done();
            else done(new Error("Not the right id"));
          //};
        });
      });
    });
    it('should have saved id as a string', function(done){
      datastore.getNode(nodeWithChild._id, function(err, node){
        if(err) return done(err);
        node.setId(1).save(function(err, nodeTmp){
          if(err) return done(err);
          //datastore.getNode(firstNode._id, function(err, node){
            if(err) return done(err);
            if(node.id === "1") done();
            else done(new Error("Not the right id"));
          //};
        });
      });
    });
    it('should have saved id data', function(done){
      datastore.getNode(firstNode._id, function(err, node){
        if(err) return done(err);
        node.setId("myNode").save(function(err, node){
          if(err) return done(err);
          //datastore.getNode(firstNode._id, function(err, node){
            if(err) return done(err);
            if(node.id === "myNode") done();
            else done(new Error("Not the right id"));
          //};
        });
      });
    });
    it('should not be able to create a node with an existing id', function(done){
      datastore.createNode({id:"myNode", name:"sameid"}, function(err, node){
        if(err) return done(null, err);
        if(node.id === "myNode") return done(new Error("Node was created"));
        done(new Error("No exception"));
        
      });
    });
    it('should not saved with same id', function(done){
      datastore.getNode(nodeWithChild._id, function(err, node){
        return done(err);
        if(err) return done(err);
        if(node.id === "myNode") done();
        else done(new Error(""));
      });
    });
  });
  
  describe('JSON-Schema for data', function(){
    // get schema here: http://www.jsonschema.net/
    var schema = {"type":"object","$schema": "http://json-schema.org/draft-03/schema","id": "http://jsonschema.net","required":false,"properties":{ "arr": { "type":"array", "description": "An array with at least 1 but maximum 3 items, but it is nor required!", "minitems": "1", "maxitems": "3", "required":false}, "number": { "type":"number", "required":false }, "pattern": { "pattern":"^Hallo", "type":"string", "description": "A field witch validates with regex", "required":false }, "req": { "type":"string", "name": "required", "description": "A required field for test", "id": "http://jsonschema.net/req", "required":true } }};
    var schemaNode;
    
    datastore.setSchema("schema", schema);
    
    it("schould create a node with valid data", function(done){
      datastore.createNode({name:"schema", data:{pattern:"Hallo Word", req: "Here it is", number: 123, arr:[1,2]}}, function(err, node){
        if(err) return done(err);
        schemaNode = node;
        if(node.data.req === "Here it is") done();
        else done(new Error("Created node is not the right one..."));
      });
    });
    it("schould not create a node with invalid data", function(done){
      datastore.createNode({name:"schema", data:{pattern:"Hello Word", number: "is an Int", arr:[1,2,3,4]}}, function(err, node){
        if(err) done();
        else done(new Error("created a node with invalid data"));
      });
    });
    it("schould not setdata to a node with invalid data", function(done){
      try {
        schemaNode.setData({});
      } catch(e) { return done(); }
      done(new Error("changed data"));
    });
    
  });
  
  
  
  
  describe('stress tests', function(){
    return;
    describe("create 1000000 nodes", function(done){
      it("should create such a mass elements", function(done){
        var total = 1000000;
        var ready = 0;
        var i = 0;
        
        var backcount = function(){
          if(++ready === total) done();
        };
        
        for(i=0; i<total; i++) {
          datastore.createNode({data: {no:"data"}, class: "one-in-a-million", id:"stress1-"+i, name:"stress"}, function(err, node){
            if(err) return done(err);
            if(!node.class === "one-in-a-million" || !node.data.no === "data" ) return done(new Error("Wrong data in stresstest"));
            else backcount();
          });
        }
      });
      
      
      it("should get all elements by id", function(done){
        var total = 1000000;
        var ready = 0;
        var i = 0;
        
        var backcount = function(){
          if(++ready === total) done();
        };
        
        for(i=0; i<total; i++) {
          datastore.getNodeById("stress1-"+i, function(err, node){
            if(err) return done(err);
            if(!node.class === "one-in-a-million" || !node.data.no === "data" ) return done(new Error("Wrong data in stresstest"));
            else backcount();
          });
        }
      });
      
    });
  });
});
