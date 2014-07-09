"use strict";

exports.depopulateChildNodes = function(children){
  var i;
  for (i=0; i<children.length; i++) {
    if(typeof(children[i]) !== "string") {
      if(typeof(children[i]) === "object" && children[i]._id) children[i] = children[i]._id;
      else throw new Error("Can't handle child nodes");
    }
  }
  return children;
};
