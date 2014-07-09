"use strict";

var async = require("async");

module.exports = function(noody){

  return function populate(node, cb){
  
    var cache = {};
    cache[node._id] = node;
    
    var getNode = function(_id, cb){
      if(cache[_id]) return cb();
      noody.getNode(_id, function(err, node){
        if(err) return cb(err);
        var i;
        
        cache[_id] = node;
        for(i=0; i<node.childNodes.length; i++){
          if(!cache[node.childNodes[i]]) queue.push(node.childNodes[i]);
        }
        cb();
        
      });
    };

    
    var populateChildNodes = function(arr, cb){
      var i;
      
      for (i=0; i<arr.length; i++) {
        if(typeof(arr[i]) !== "string") return cb("Not a well formed nodes!");
        
        arr[i] = cache[arr[i]];
      }
    };

    

    var queue = async.queue(getNode, 16);
    
    queue.drain = function(){
      var hash;
      
      // now link to child nodes...
      for(hash in cache) {
        populateChildNodes(cache[hash].childNodes);
      }
      
      cb(null, node);
    };
    queue.push(node.childNodes);
    

  };
};