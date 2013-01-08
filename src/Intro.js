var Intro = function(canvas) {

  var ctx = canvas.getContext('2d');

  var mioSpriteImage = SpriteLoader.image(Sprites.MIO);
  var mioSpriteFrame = 0;
  var mioSpriteFrameDt = 0;

  var pressEnterFrameDt = 0;

  var isIntroDone = false;
  var renderPressEnter = true;

  var isStartScreen = true;
  var mioIsDrinkingJager = false;
  var mioIsDrunk = false;
  var mioIsReadyToPlay = false;

  var mio = {
    nykter: 100
  }

  init();

  function init() {
    SoundManager.playMusic(Sounds.TITLESCREEN);
  }

  this.isDone = function() {
    return isIntroDone;
  }

  this.update = function(dt) {
    handleUserInput();

    updateMio(dt);

    animatePressEnter(dt);
    animateMio(dt);

    renderScene();
  }

  function updateMio(dt) {
    if (mioIsDrinkingJager) {
      mioSpriteFrameDt += dt;

      if (mioSpriteFrameDt >= 10) {
        mio.nykter -= 2;
        mioSpriteFrameDt = 0;

        if (mio.nykter <= 50) {
          mio.nykter = 50;

          mioIsDrunk = true;
          mioIsDrinkingJager = false;
          mioSpriteFrameDt = 0;
        }
      }
    }
  }

  function handleUserInput() {
    if (Keys.isKeyDown(13)) {
      //isIntroDone = true;

      if (isStartScreen) {        
        isStartScreen = false;
        mioIsDrinkingJager = true;

        mioSpriteImage = SpriteLoader.image(Sprites.MIOJAGER);
        mioSpriteFrame = 0;
        mioSpriteFrameDt = 0;

        SoundManager.playEffect(Sounds.SLURP);
      }

    }
  }

  function animateMio(dt) {

    if (isStartScreen) {
      mioSpriteFrameDt += dt;

      if (mioSpriteFrameDt >= 500) {
        mioSpriteFrameDt = 0;
        ++mioSpriteFrame;

        if (mioSpriteFrame >= 3) {
          mioSpriteFrame = 1;
        }
      }
    }

    if (mioIsDrinkingJager) {
      mioSpriteFrame = parseInt((Math.min(100 - mio.nykter, 30) / 30) * 3);
    }

    if (mioIsDrunk) {
      mioSpriteFrameDt += dt;

      if (mioSpriteFrameDt >= 300) {
        mioSpriteFrameDt = 0;
        --mioSpriteFrame;

        if (mioSpriteFrame <= 0) {
          mioSpriteFrame = 0;

          if (!SoundManager.isPlayinfEffect()) {
            mioSpriteImage = SpriteLoader.image(Sprites.MIO);

            mioIsDrunk = false;
            mioIsReadyToPlay = true;
            isIntroDone = true;

            SoundManager.stopMusic();
          }
        }
      }
    }

  }

  function animatePressEnter(dt) {   
    pressEnterFrameDt += dt; 

    if (pressEnterFrameDt >= 750) {
      pressEnterFrameDt = 0;
      renderPressEnter = !renderPressEnter;
    }
  }

  function renderNykterAsHud() {
    ctx.font = "18pt Arial";
    ctx.fillStyle = 'white';
    ctx.fillText("NYKTERMETER", 4, 40);

    ctx.fillStyle = 'black';
    ctx.fillRect(190, 10, 300, 40);

    var red = (mio.nykter / 100.0);
    var green = (100 - mio.nykter) / 100.0;

    ctx.fillStyle = 'rgb(' + parseInt(red * 256.0) + ',' + parseInt(green * 256.0) + ',50)';
    ctx.fillRect(195, 15, 290 * (mio.nykter / 100), 30);
  }

  function renderScene() {
    ctx.clearRect(0, 0, 500, 320);

    if (mioIsDrinkingJager || mioIsDrunk) {
      ctx.globalAlpha = 0.2;
    }

    if (isStartScreen) {
      ctx.drawImage(SpriteLoader.image(Sprites.TITLESCREEN), 0, 0, 500, 320);
    }
    
    ctx.globalAlpha = 1.0;

    if (mioIsDrinkingJager || mioIsDrunk) {
      renderNykterAsHud();
    }

    if (isStartScreen && renderPressEnter) {
      ctx.drawImage(SpriteLoader.image(Sprites.PRESSENTER), 130, 290);
    }
    
    if (isStartScreen || mioIsReadyToPlay) {
      ctx.drawImage(SpriteLoader.image("MIO"), mioSpriteFrame * 58, 0, 58, 100, 500/2-58/2, 175, 58, 100);
    }
    else if (mioIsDrinkingJager || mioIsDrunk) {
     ctx.drawImage(mioSpriteImage, mioSpriteFrame * 120, 0, 120, 100, 500/2-120/2, 175, 120, 100); 
    }
  }
  
};
