var MapTileBuilder = function() {
  
  var mapTile = {
    x: 0,
    y: 0,
    tile: undefined
  }; 

  this.x = function(x) {
    mapTile.x = x;
    return this;
  }

  this.y = function(y) {
    mapTile.y = y;
    return this;
  }

  this.tile = function(tile) {
    mapTile.tile = tile;
    return this;
  }

  this.build = function() {
    return mapTile;
  }

}