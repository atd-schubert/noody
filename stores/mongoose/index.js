"use strict";



var depopulateChildNodes = require("../utils").depopulateChildNodes;

var getModel = require("./model");

var Store = function MongooseStore(opts){

  if(!opts) throw new Error("The mongoose store needs options to setup!");
  if(!opts.mongoose) throw new Error("The mongoose store needs mongoose to handle store!");
  
  // opts.modelName
  
  // var mongoose = opts.mongoose;
  
  var model = getModel(opts);
  
  var unmongoosify = function(node){
  
    if(!node) return false;
    var tmp = {
      _id: node._id.toString(),
      id: node.id,
      class: node.class.join(" "),
      name: node.name,
      data: node.data,
      childNodes: [],
    }
    var i;
    
    for (i=0; i<node.childNodes.length; i++) {
      tmp.childNodes.push(node.childNodes[i].toString());
    }
    return tmp;
  };
  
  this.getNode = function(_id, cb){
    model.getNode(_id, function(err, node){
      if (err) return cb(err);
      cb(err, unmongoosify(node));
    });
  };
  this.getNodeById = function(id, cb){
    model.getNodeById(id, function(err, node){
      if (err) return cb(err);
      cb(err, unmongoosify(node));
    });
  };
  this.createNode = function(opts, cb){
    if(opts.class) opts.class = opts.class.split(" ");
    if(opts.childNodes) opts.childNodes = depopulateChildNodes(opts.childNodes);
    try {
      (new model(opts)).save(function(err, node){
        if(err) return cb(err);
        cb(err, unmongoosify(node));
      });
    } catch(e) {
      console.log(opts);
      if(!e) e = new Error("Model didnt match!");
      cb(e); // Do we really need a try-catch?
    }
  };
  this.writeNode = function(_id, opts, cb){
    var sets = {};
    if(opts.setId) sets.id = opts.setId;
    if(opts.setName) sets.name = opts.setName;
    if(opts.setChildNodes) sets.childNodes = depopulateChildNodes(opts.setChildNodes);
    if(opts.setData) sets.data = opts.setData;
    if(opts.setClass) sets.class = opts.setClass.split(" ");
    
    model.findByIdAndUpdate(_id, { $set: sets}, function(err, node){
      if (err) return cb(err);
      cb(err, unmongoosify(node));
    });
    
  };
  this.deleteNode = function(_id, cb, opts){
    model.findByIdAndRemove(_id, opts, cb);
  };
  this.findNodes = function(queryObj, cb) {
    model.find(queryObj, function(err, nodes){
      if(err) return cb(err);
      var arr = [], i;
      for(i=0;i<nodes.length; i++) {
        arr.push(unmongoosify(nodes[i]));
      }
      cb(null, arr);
    });
  };
  this.findOneNode = function(queryObj, cb) {
    model.findOne(queryObj, function(err, node){
      if(err) return cb(err);
      cb(err, unmongoosify(node));
    });
  };
};

module.exports = Store;