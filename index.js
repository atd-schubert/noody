"use strict";

var Populate = require("./populate");

var Noody = function Noody(opts){
  opts = opts || {};
  
  var store = opts.store || new Noody.Stores.virtual();
  
  var Node = require("./node")(store);
  
  
  this.__defineGetter__('store', function(){
  	return store;
  });
  this.__defineSetter__('store', function(val){
  	console.warn('It isn\'t allowed to set the property store!');
  });
  
  this.getNode = function(_id, cb){
    Node.getNode(_id, cb);
  };
  this.getNodeById = function(id, cb){
    Node.getNodeById(id, cb);
  };
  this.createNode = function(data, cb){
    Node.createNode(data, cb);
  };
  
  this.populate = Populate(this);
  
}

Noody.Stores = {
  virtual: require("./stores/virtual"),
  mongoose: require("./stores/mongoose")
}
module.exports = Noody;