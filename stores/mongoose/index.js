"use strict";



var depopulateChildNodes = require("../utils").depopulateChildNodes;

var getModel = require("./model");

var Store = function MongooseStore(opts){

  if(!opts) throw new Error("The mongoose store needs options to setup!");
  if(!opts.mongoose) throw new Error("The mongoose store needs mongoose to handle store!");
  
  // opts.modelName
  
  // var mongoose = opts.mongoose;
  
  var model = getModel(opts);
  
  this.getNode = function(_id, cb){
    model.getNode(_id, cb);
  };
  this.getNodeById = function(id, cb){
    model.getNodeById(id, cb);
  };
  this.createNode = function(opts, cb){
    try {
      (new model(opts)).save(cb);
    } catch(e) {
      cb(e); // Do we really need a try-catch?
    }
  };
  this.writeNode = function(_id, opts, cb){
    var sets = {};
    if(opts.setId) sets.id = opts.setId;
    if(opts.setName) sets.name = opts.setName;
    if(opts.setChildNodes) sets.childNodes = opts.setChildNodes;
    if(opts.setData) sets.data = opts.setData;
    if(opts.setClass) sets.class = opts.setId.split(" ");
    
    model.findByIdAndUpdate(_id, { $set: sets}, cb);
    
  };
  this.deleteNode = function(_id, cb, opts){
    model.findByIdAndRemove(_id, opts, cb);
  };