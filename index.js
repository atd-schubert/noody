"use strict";

var Populate = require("./populate");

var Noody = function Noody(opts){
  opts = opts || {};
  var store = opts.store || new Noody.Stores.virtual();
  
  var schemas = {};
  var Node = require("./node")(store, schemas);
  
  
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
  this.findNodes = function(queryObj, cb){
    Node.find(queryObj, cb);
  };
  this.findOneNode = function(queryObj, cb){
    Node.findOne(queryObj, cb);
  };
  
  this.setSchema = function(name, json){
    schemas[name] = json;
  };
  this.getSchema = function(name){
    return schemas[name];
  };
  this.removeSchema = function(name){
    schemas[name] = undefined;
  };
  
  this.populate = Populate(this);
  
}

Noody.Stores = {
  virtual: require("./stores/virtual"),
  mongoose: require("./stores/mongoose")
}
module.exports = Noody;