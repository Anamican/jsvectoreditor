VectorEditor.prototype.deleteSelection = function(){
  while(this.selected.length > 0){
    this.deleteShape(this.selected[0])
  }
}

VectorEditor.prototype.deleteShape = function(shape){
  this.fire("delete",shape)
  if(shape && shape.node && shape.node.parentNode){
    shape.remove()
  }
  for(var i = 0; i < this.trackers.length; i++){
    if(this.trackers[i].shape == shape){
      this.removeTracker(this.trackers[i]);
    }
  }
  for(var i = 0; i < this.shapes.length; i++){
    if(this.shapes[i] == shape){
      this.shapes.splice(i, 1)
    }
  }
  for(var i = 0; i < this.selected.length; i++){
    if(this.selected[i] == shape){
      this.selected.splice(i, 1)
    }
  }
  //should remove references, but whatever
}

VectorEditor.prototype.deleteAll = function(){
  this.fire("clear2")
  this.draw.clear()
  this.shapes = []
  this.trackers = []
}

VectorEditor.prototype.clearShapes = function(){
  this.fire("clear")
  while(this.shapes.length > 0){
    this.deleteShape(this.shapes[0])
  }
}

VectorEditor.prototype.generateUUID = function(){
  var uuid = ""
  for(var i = 0; i < 16; i++){
    uuid += "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random()*Math.min(36,26+i)));
  }
  return "shape:"+uuid;
}

VectorEditor.prototype.getShapeById = function(v){
  for(var i=this.shapes.length;i--&&this.shapes[i].id!=v;);
  return this.shapes[i]
}

VectorEditor.prototype.addShape = function(shape){
  this.fire("addshape",shape)
  shape.node.shape_object = shape
  this.selected = [shape]
  this.shapes.push(shape)
}

VectorEditor.prototype.rectsIntersect = function(r1, r2) {
  return r2.x < (r1.x+r1.width) && 
          (r2.x+r2.width) > r1.x &&
          r2.y < (r1.y+r1.height) &&
          (r2.y+r2.height) > r1.y;
}

VectorEditor.prototype.drawGrid = function(){
  this.draw.drawGrid(0, 0, 480, 272, 10, 10, "blue").toBack()
}

VectorEditor.prototype.move = function(shape, x, y){
  shape.translate(x,y)
  if(shape._ && shape._.rt){
    shape.rotate(shape._.rt.deg, true)
  }
}


VectorEditor.prototype.scale = function(shape, corner, x, y){
  var xp = 0, yp = 0
  var box = shape.getBBox()
  switch(corner){
    case "tr":
      xp = box.x
      yp = box.y + box.height
      break;
    case "bl":
      xp = box.x + box.width
      yp = box.y
      break;
    case "tl":
      xp = box.x + box.width;
      yp = box.y + box.height;
    break;
    case "br":
      xp = box.x
      yp = box.y
    break;
  }
  shape.scale(x, y, xp, yp)
}

VectorEditor.prototype.resize = function(object, width, height, x, y){
  if(object.type == "rect" || object.type == "image"){
    if(width > 0){
      object.attr("width", width)
    }else{
      object.attr("x", (x?x:object.attr("x"))+width)
      object.attr("width", Math.abs(width)) 
    }
    if(height > 0){
      object.attr("height", height)
    }else{
      object.attr("y", (y?y:object.attr("y"))+height)
      object.attr("height", Math.abs(height)) 
    }
  }else if(object.type == "ellipse"){
    if(width > 0){
      object.attr("rx", width)
    }else{
      object.attr("x", (x?x:object.attr("x"))+width)
      object.attr("rx", Math.abs(width)) 
    }
    if(height > 0){
      object.attr("ry", height)
    }else{
      object.attr("y", (y?y:object.attr("y"))+height)
      object.attr("ry", Math.abs(height)) 
    }
  }else if(object.type == "text"){
    object.attr("font-size", Math.abs(width))
  }
}
