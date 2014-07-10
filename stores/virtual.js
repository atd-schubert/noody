"use strict";



var depopulateChildNodes = require("./utils").depopulateChildNodes;

var Store = function(){
  console.warn("Waring: You use the virtual store to save data! This is not recommended! You should use database managed store...");
  var localStore = {};
  var ids = {};
  var nextId = 0;

  this.getNode = function(_id, cb){
    if(!localStore[_id]) return cb(null, false);
  
    cb(null, JSON.parse(JSON.stringify(localStore[_id]))); // get a clone to prevent data changes!
  };
  this.getNodeById = function(id, cb){
    cb(null, JSON.parse(JSON.stringify(ids[id]))); // get a clone to prevent data changes!
  };
  this.createNode = function(opts, cb){
    if(localStore[nextId]) return cb("Can't create node. There is already a node with this name!");
    if(!opts.name) return cb("A node have to have a name!");
    
    var _id = nextId++;
    _id += ""; // make a string...
    opts.data = opts.data || {};
    
    // TODO: validate correct form of childNodes ([_id1, _id2...] not [{_id:_id1},{_id:_id2}])
    opts.childNodes = opts.childNodes || [];
    
    opts.childNodes = depopulateChildNodes(opts.childNodes);
    var tmp = {
      data: opts.data,
      _id: _id,
      name: opts.name,
      childNodes: opts.childNodes
    };
    
    if(opts.id) tmp.id = opts.id;
    if(opts.class) tmp.class = opts.class;
    
    localStore[_id] = tmp;
    
    this.getNode(_id, cb);
  };
  this.writeNode = function(_id, opts, cb){
    if(!localStore[_id]) return cb("There is no node to change! Please create a node first before make changes on it...");
    var ls = localStore[_id];
    
    if(opts.setData) ls.data = opts.setData;
    if(opts.setName) ls.name = opts.setName.toLowerCase();
    if(opts.setId) ls.id = ids[opts.SetId] = opts.SetId;
    if(opts.setClass) ls.class = opts.setClass;
    
    if(opts.setChildNodes) ls.childNodes = depopulateChildNodes(opts.setChildNodes);
    if(opts.appendChildNode) ls.childNodes.push(depopulateChildNodes([opts.appendChildNode])[0]);
    if(opts.prependChildNode) ls.childNodes.unshift(depopulateChildNodes([opts.prependChildNode])[0]);
    
    this.getNode(_id, cb);
    
  };
  this.deleteNode = function(_id, cb, opts){ // Maybe opts.force to delete refferred nodes
    delete localStore[_id];
    cb(null, true);
  };
};


module.exports = Store;