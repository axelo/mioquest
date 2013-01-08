function SpriteLoader() {

  var spriteImages = {};
  
  this.load = function(sprites, cb) {

    var spriteIds = Object.keys(sprites);
    var numOfSpritesToLoad = spriteIds.length;
    var loadedSprites = 0;

    spriteIds.forEach(function(id) {

      var img = new Image();
      img.src = sprites[id];

      img.onload = function() {
        console.log("Sprite " + id  + " => '" + img.src + "' loaded.");

        spriteImages[id] = img;
        sprites[id] = id;

        if (++loadedSprites === numOfSpritesToLoad) cb();
      }

      img.onerror = function() {
        console.log("Could not load sprite " + id  + " => '" + img.src + "'");

        if (++loadedSprites === numOfSpritesToLoad) cb();
      }

    });
  }

  this.image = function(id) {
    return spriteImages[id];
  }

}

window.SpriteLoader = new SpriteLoader();
