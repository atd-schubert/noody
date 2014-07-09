"use strict";


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
    new Node(_id, cb);
  };
  this.createNode = function(data, cb){
    new Node.create(data, cb);
  };
  
}

Noody.Stores = {
  virtual: require("./stores/virtual")
}

module.exports = Noody;