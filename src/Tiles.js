var Tiles = {

  BEER : new TileBuilder()
          .sprite("BEER")
          .width(32)
          .height(64)
          .collisionRect(10, 28, 12, 32)
          .alkohol(true)
          .build(),

  CRATE : new TileBuilder()
          .sprite("CRATE")
          .width(64)
          .height(52)
          .collisionRect(12 , 12, 40, 32)
          .build(),

  MORAKLOCKA : new TileBuilder()
          .sprite("MORAKLOCKA")
          .width(58)
          .height(163)
          .collisionRect(6, 128, 48, 32)
          .build(),

  PSY : new TileBuilder()
          .sprite("PSY")
          .width(110)
          .height(110)
          .collisionRect(54, 72, 32, 20)
          .onanimate(function(dt) {
            this.animation.dt += dt;

            if (this.animation.dt >= 100) {
              this.animation.dt = 0;
              this.sprite.sx = (this.sprite.sx + this.size.w) % 440;
            }
          })
          .build(),

  BARREL : new TileBuilder()
          .sprite("BARREL")
          .width(64)
          .height(53)
          .collisionRect(0, 0, 64, 53)
          .onmapupdate(function() {
            this.vx |= 0;
            this.x -= +.5;
          })
          .build(),

  BARRELMAN : new TileBuilder()
          .sprite("BARRELMAN")
          .width(83)
          .height(126)
          .collisionRect(8, 92, 38, 32)
          .onanimate(function(dt) {
            this.animation.dt += dt;

            if (this.animation.dt >= 100) {
              this.animation.dt = 0;
              this.sprite.sx = (this.sprite.sx + this.size.w) % 498;
            }
          })
          .onmapupdate(function() {
            this.x -= +.5;
          })
          .build(),

  SHM1 : new TileBuilder()
          .sprite("SHM1")
          .width(66)
          .height(150)
          .collisionRect(10, 112, 48, 32)
          .onanimate(function(dt) {
            this.animation.dt += dt;

            if (this.animation.dt >= 500) {
              this.animation.dt = 0;
              this.sprite.sx = (this.sprite.sx + this.size.w) % 132;
            }
          })
          .build(),

  SHM2 : new TileBuilder()
          .sprite("SHM2")
          .width(66)
          .height(150)
          .collisionRect(10, 112, 48, 32)
          .onanimate(function(dt) {
            this.animation.dt += dt;

            if (this.animation.dt >= 250) {
              this.animation.dt = 0;
              this.sprite.sx = (this.sprite.sx + this.size.w) % 132;
            }
          })
          .onmapupdate(function() {
            //this.x -= +.5;
          })
          .build(),

  SHM3 : new TileBuilder()
          .sprite("SHM3")
          .width(66)
          .height(150)
          .collisionRect(10, 112, 48, 32)
          .onanimate(function(dt) {
            this.animation.dt += dt;

            if (this.animation.dt >= 500) {
              this.animation.dt = 0;
              this.sprite.sx = (this.sprite.sx + this.size.w) % 132;
            }
          })
          .build(),

  PARSTROM : new TileBuilder()
          .sprite("PARSTROM")
          .width(69)
          .height(69)
          .collisionRect(10, 10, 49, 49)
          .onanimate(function(dt) {
            this.animation.dt += dt;

            if (this.animation.dt >= 200) {
              this.animation.dt = 0;
              this.sprite.sx = (this.sprite.sx + this.size.w) % 552;
            }
          })
          .onmapupdate(function() {            
            if (!SoundManager.isOrGoingToPlayEffect("PARSTROM")) {
              SoundManager.playEffect("PARSTROM", true);
            }
          })
          .onremoved(function() {
            SoundManager.stopEffect("PARSTROM");
          })
          .build(),

  DWCSOUNDTILE_START : new TileBuilder()
          .onmapupdate(function() {            
            if (!SoundManager.isOrGoingToPlayEffect("DONTYOUWORRYCHILD")) {
              SoundManager.playEffect("DONTYOUWORRYCHILD");
            }
          })
          .build(),

  DWCSOUNDTILE_STOP : new TileBuilder()
          .onremoved(function() {
            SoundManager.stopEffect("DONTYOUWORRYCHILD");
          })
          .build(),

  PSYSOUNDTILE_START : new TileBuilder()
          .onmapupdate(function() {            
            if (!SoundManager.isOrGoingToPlayEffect("GANGNAMSTYLE")) {
              SoundManager.playEffect("GANGNAMSTYLE");
            }
          })
          .build(),

  PSYSOUNDTILE_STOP : new TileBuilder()
          .onremoved(function() {
            SoundManager.stopEffect("GANGNAMSTYLE");
          })
          .build(),

  PRESSBYRAN : new TileBuilder()
          .sprite("PRESSBYRAN")
          .width(439)
          .height(271)
          .collisionRect(240, 200, 32, 64)
          .build(),

  DODSFANTA : new TileBuilder()
          .sprite("DODSFANTA")
          .width(38)
          .height(100)
          .collisionRect(-10, 60, 55, 32)
          .build(),
  
  STOP_DODSFANTA : new TileBuilder()
          .width(32)
          .height(32)
          .collisionRect(0 ,0, 32, 32)
          .build(),

  MSGNYKTER : new TileBuilder()
          .sprite("MSGNYKTER")
          .width(380)
          .height(60)
          .collisionRect(0 ,0, 380, 60)
          .build(),

  MSGOL : new TileBuilder()
          .sprite("MSGOL")
          .width(380)
          .height(60)
          .collisionRect(0, 0, 380, 60)
          .build(),

  FINISHLINE : new TileBuilder()
          .sprite("FINISHLINE")
          .width(64)
          .height(140)
          .collisionRect(0, -32, 64, 172)
          .build(),

};
