"use strict";



module.exports = function(opts){
  
  mongoose = opts.mongoose;
  var modelName = opts.modelName || "_noody";
  
  var schema = new mongoose.Schema({
    id: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: true
    },
    class: {
      type: [String]
    },
    data: {
      type: mongoose.Schema.Types.Mixed
    },
    childNodes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: modelName,
    }],
  }, { id: false });
  
  schema.statics.getNode = function(_id, cb){
    this.findOne({_id:_id}, cb);
  };
  schema.statics.getNodeById = function(id, cb){
    this.findOne({id:id}, cb);
  };
  schema.statics.getNodesByClass = function(className, cb){
    this.find({class:className}, cb);
  };
  schema.statics.getNodesByName = function(nodeName, cb){
    this.find({name:nodeName}, cb);
  };
  
  
  return mongoose.model(modelName, schema);
};