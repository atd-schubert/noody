"use strict";

var depopulateChildNodes = require("./stores/utils").depopulateChildNodes;

module.exports = function(store){
  
  var Node = function Node(nodeData){
  
    var _id = nodeData._id;
    var _deleted = nodeData._deleted || false;
    //var _loaded = false;
    var self = this;
    
    var transactions = {
      setId: false,
      setName: false,
      setClass: false,
      setChildNodes: false,
      setData: false
    };
    
    this.__defineGetter__('_id', function(){
    	return _id;
    });
    this.__defineSetter__('_id', function(val){
    	console.warn('It isn\'t allowed to set the property _id!');
    });
    
    this.stringify = function(a,b) {
      return JSON.stringify({
        _id:this._id,
        data:this.data,
        class:this.class,
        id:this.id,
        childNodes:this.childNodes,
        name:this.name,
      }, a, b);
    };
    
    this.setId = function(value){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setId = true;
      this.id = value;
      return this;
    };
    this.setName = function(value){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setName = true;
      this.name = value;
      return this;
    };
    this.setClass = function(value){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setClass = true;
      this.class = value;
      return this;
    };
    this.setData = function(value){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setData = true;
      if(value) this.data = value; // It is also possible to activate data saving from the original object... 
      return this;
    };
    
    
    this.appendChild = function(_id){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setChildNodes = true;
      this.childNodes.push(depopulateChildNodes([_id])[0]);
      return this;
    };
    this.prependChild = function(_id){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setChildNodes = true;
      this.childNodes.unshift(depopulateChildNodes([_id])[0]);
      return this;
    };
    this.setChildNodes = function(arr){
      if(_deleted) throw new Error("Can't work with a deleted Node!");
      
      transactions.setChildNodes = true;
      this.childNodes = depopulateChildNodes(arr);
      return this;
    };
    
    
    
    
    
    this.save = function(cb, opts){
      if(_deleted) return cb("Can't work with a deleted Node!");
      
      opts = opts || transactions;
      
      this.childNodes = depopulateChildNodes(this.childNodes);
      
      var tmp = {};
      if(opts.setId) tmp.setId = this.id;
      if(opts.setName) tmp.setName = this.name;
      if(opts.setClass) tmp.setClass = this.class;
      if(opts.setChildNodes) tmp.setChildNodes = this.childNodes;
      if(opts.setData) tmp.setData = this.data;
      
      store.writeNode(_id, {
        setId: this.id,
        setName: this.name,
        setClass: this.class,
        setChildNodes: this.childNodes,
        setData: this.data
      }, function(err){
        if(err) return cb(err);
        transactions = { // reset...
          setId: false,
          setName: false,
          setClass: false,
          setChildNodes: false,
          setData: false
        }
        cb(null, self);
      });
    };
    
    this.delete = function(cb, opts){
      _deleted = true;
      store.deleteNode(_id, cb, opts);
    };
    
    
    
      
      
      self.class = nodeData.class;
      self.id = nodeData.id;
      self.childNodes = nodeData.childNodes;
      self.name = nodeData.name;
      self.data = nodeData.data;
      
    
  };
  Node.createNode = function createNode(opts, cb){
    store.createNode(opts, function(err, data){
      if(err) return cb(err);
      cb(null, new Node(data));
    });
  };
  
  Node.getNode = function(_id, cb){
    store.getNode(_id, function(err, nodeData){
      if(err) return cb(err);
      if(!nodeData) {
        nodeData = {
          _deleted: true,
          class: "",
          id: "",
          childNodes: [],
          name: "deleted",
          data: {}
        };
      }
      
      cb(null, new Node(nodeData));
    });
  }
  Node.getNodeById = function(id, cb){
    store.getNodeById(id, function(err, nodeData){
      if(err) return cb(err);
      if(!nodeData) {
        nodeData = {
          _deleted: true,
          class: "",
          id: "",
          childNodes: [],
          name: "deleted",
          data: {}
        };
      }
      
      cb(null, new Node(nodeData));
    });
  }
  
  return Node;
};