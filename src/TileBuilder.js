var TileBuilder = function() {

  var tile = {
    size: {
      w: 0,
      h: 0      
    },

    collisionRect: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },

    sprite: {
      id: "",
      sx: 0,
      sy: 0
    },

    animation : {
      dt: 0
    },

    isAlkohol : false,
    isCollidable : true,

    onanimate : function(dt) {},

    onmapupdate : function(dt) {},

    onremoved : function(dt) {}
  };

  this.build = function() {
    return tile;
  }

  this.width = function(w) {
    tile.size.w = w;
    return this;
  }

  this.height = function(h) {
    tile.size.h = h;
    return this;
  }

  this.sprite = function(id, sx, sy) {
    tile.sprite.id = id;
    tile.sprite.sx = sx || 0;
    tile.sprite.sy = sy || 0;
    return this;
  }

  this.alkohol = function(isAlkohol) {
    tile.isAlkohol = isAlkohol;
    return this;
  }

  this.collisionRect = function(x, y, w, h) {
    tile.collisionRect.x = x;
    tile.collisionRect.y = y;
    tile.collisionRect.w = w;
    tile.collisionRect.h = h;
    return this;
  }

  this.onanimate = function(f) {
    tile.onanimate = f;
    return this;
  }

  this.onmapupdate = function(f) {
    tile.onmapupdate = f;
    return this;
  }

  this.onremoved = function(f) {
    tile.onremoved = f;
    return this;
  }

}
