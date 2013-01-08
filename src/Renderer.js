var Renderer = function(map, mio) {

  var self = this;

  var ctx;
  var drawInstructions = [];
  var startTile = 0;

  var visibleTiles;
  var hideHud = false;
  var hideMio = false;

  this.mapx = 0; //3800;
  this.renderCollisionRects = false;

  this.reset = function() {
    this.mapx = 0;
    startTile = 0;
    visibleTiles = [];
  }

  this.renderScene = function(dt) {
    if (!ctx) {
      var cvs = document.getElementById("canvas");
      ctx = document.getElementById("canvas").getContext('2d');
    }
    
    drawInstructions.length = 0;

    visibleTiles = {};

    renderMap();
    renderMio();

    animateVisibleTiles(dt);

    drawInstructions.sort(function(a, b) {
      return a.depth - b.depth;
    });

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    renderBackground(SpriteLoader.image(map.background), 0, 260, 0.2);
    renderBackground(SpriteLoader.image(map.foreground), 196, 0, 1);

    for (var i = 0; i < drawInstructions.length; ++i) {
      drawInstructions[i].draw();
    }

    renderHud();
  }

  this.hideHud = function() {
    hideHud = true;
  }

  this.hideMio = function() {
    hideMio = true;
  }

  function renderHud() {
    if (!hideHud) renderNykterAsHud();
  }

  function renderNykterAsHud() {
    ctx.font = "18pt Arial";
    ctx.fillStyle = 'black';
    ctx.fillText("NYKTERMETER", 4, 40);

    ctx.fillStyle = 'black';
    ctx.fillRect(190, 10, 300, 40);

    var red = (mio.nykter / 100.0);
    var green = (100 - mio.nykter) / 100.0;

    ctx.fillStyle = 'rgb(' + parseInt(red * 256.0) + ',' + parseInt(green * 256.0) + ',50)';
    ctx.fillRect(195, 15, 290 * (mio.nykter / 100), 30);
  }

  function renderBackground(img, y, sy, speed) {

    var bgx = (self.mapx * speed) % img.width;
    var width = ctx.canvas.width;
    var height = Math.min(img.height, ctx.canvas.height);

    if (bgx + width >= img.width) {
      width -= (bgx + width) - img.width;

      var deltaW = parseInt(500 - width);

      ctx.drawImage(img, 0, sy, deltaW, height, width, y, deltaW, height);
    }

    ctx.drawImage(img, bgx, sy, width, height, 0, y, width, height);
  }

  function renderMio() {
    if (hideMio) return;

    drawInstructions[drawInstructions.length] = {
      depth: mio.y + mio.tile.collisionRect.y,
      draw: function() {
        var img = SpriteLoader.image("MIOLEGS");
        var sx = (mio.animation.legframe % 3) * 120;
        var sx2 = (mio.animation.frame % 3) * 120;

        ctx.drawImage(SpriteLoader.image(mio.tile.sprite.id), sx2, 0, 120, 100, mio.x, mio.y, 120, 100);
        ctx.drawImage(img, sx, 0, 120, 48, mio.x - 8, mio.y + 50, 120, 48);

        if (self.renderCollisionRects) {
          if (mio.collided) {
            ctx.strokeStyle = 'yellow';  
          } 
          else {
            ctx.strokeStyle = 'blue';
          }
          
          var x = (mio.x + mio.tile.collisionRect.x + 0.5) | 0;
          var y = (mio.y + mio.tile.collisionRect.y + 0.5) | 0;

          ctx.strokeRect(x, y,
            mio.tile.collisionRect.w, mio.tile.collisionRect.h);
        }
      }
    };
  }

  function renderMap() {
    numOfVisibleTiles = 0;

    mio.collided = false;
    mio.collidedWith = [];

    for (var i = startTile; i < map.tiles.length; ++i) {

      var mapTile = map.tiles[i];
      var tile = Tiles[mapTile.tile];
      var isNotYetShown = mapTile.x > self.mapx + 500;

      if (isNoLongerVisible(i)) {        
        if (isNoLongerVisible(i - 1)) {
          console.log("gone", tile);
          startTile = i + 1;

          tile.onremoved.call(mapTile);
        }

        continue;
      }

      if (isNotYetShown) break; // Assumes nothing goes forward

      tile.onmapupdate.call(mapTile);

      if (tile.sprite.id !== "") visibleTiles[tile.sprite.id] = true;

      if (mapTile.removed) continue;

      // check collision with mio
      if (intersectRect(mapTile)) {

        mio.collided = true;

        if (!hasMioOnceCollidedWith(mapTile)) {
          mio.collidedWith[mio.collidedWith.length] = mapTile;
          mio.hasOnceCollidedWith[mio.hasOnceCollidedWith.length] = mapTile;
        }
      }
      
      //if (tile.sprite.id !== "") {

        drawInstructions[drawInstructions.length] = (function (img, tile, mapTile, depth, mapx) {
          return {
            depth: depth, 
            draw: function() {
              var x = (mapTile.x - mapx + 0.5) | 0;
              var y = (mapTile.y + 0.5) | 0;

              if (tile.sprite.id !== "") {
                ctx.drawImage(img, 
                  tile.sprite.sx, tile.sprite.sy, tile.size.w, tile.size.h,
                  x, y, tile.size.w, tile.size.h);
              }

              var cx = mapTile.x + tile.collisionRect.x - mapx;
              var cy = mapTile.y + tile.collisionRect.y;

              if (self.renderCollisionRects) {
                ctx.strokeStyle = 'red';
                ctx.strokeRect(cx, cy, tile.collisionRect.w, tile.collisionRect.h);
              }
            }
        };
        })(SpriteLoader.image(tile.sprite.id), tile, mapTile, mapTile.y + tile.collisionRect.y, self.mapx);
        
      //}

    }
  }

  function isNoLongerVisible(mapTileIndex) {
    if (mapTileIndex < 0) return true;

    var mapTile = map.tiles[mapTileIndex];
    var tile = Tiles[mapTile.tile];

    return (mapTile.x + tile.size.w) < self.mapx;
  }

  function animateVisibleTiles(dt) {
    for (var p in visibleTiles) {
      if (visibleTiles.hasOwnProperty(p)) {
        var tile = Tiles[p];
        tile.onanimate.call(tile, dt);
      }
    }
  }

  function hasMioOnceCollidedWith(mapTile) {  
    var alreadyCollided = false;

    mio.hasOnceCollidedWith.forEach(function(oldMapTile) {
      if (oldMapTile === mapTile) {
        alreadyCollided = true;
      }
    });

    return alreadyCollided;
  }

  function intersectRect(mapTile) {
    var tile = Tiles[mapTile.tile];

    var tileDepth = mapTile.y + tile.collisionRect.y
    var mioDepth = mio.y + mio.tile.collisionRect.y

    if (mioDepth < tileDepth) return false;

    var r1 = {
      left: mio.x + mio.tile.collisionRect.x,
      right: mio.x + mio.tile.collisionRect.x + mio.tile.collisionRect.w,
      top: mio.y + mio.tile.collisionRect.y,
      bottom: mio.y + mio.tile.collisionRect.y + mio.tile.collisionRect.h
    };

    var r2 = {
      left: mapTile.x + tile.collisionRect.x - self.mapx,
      right: mapTile.x + tile.collisionRect.x - self.mapx + tile.collisionRect.w,
      top: mapTile.y + tile.collisionRect.y,
      bottom: mapTile.y + tile.collisionRect.y + tile.collisionRect.h
    };

    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
  }

};
