function SoundManager() {

  var context = new webkitAudioContext();
  var buffers = {};
  var playedEffects = {};

  var musicGainNode = context.createGain();
  var effectGainNode = context.createGain();

  var currentMusicBuffer;
  var lastEffectSource;

  var isMuted = false;

  musicGainNode.connect(context.destination);
  effectGainNode.connect(context.destination);

  musicGainNode.gain.value = 0.5;
  effectGainNode.gain.value = 0.5;

  this.load = function(sounds, cb) {

    var soundIds = Object.keys(sounds);
    var numOfSounds = soundIds.length;
    var loadedSounds = 0;

    soundIds.forEach(function(sound) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', sounds[sound], true);
      xhr.responseType = 'arraybuffer';
      
      xhr.onload = function(e) {
        context.decodeAudioData(xhr.response, function(buffer) {
          buffers[sound] = buffer;

          console.log("Sound " + sound + " => '" + sounds[sound] + "'' loaded.")

          sounds[sound] = sound;

          if (++loadedSounds === numOfSounds) cb();
        });
      };

      xhr.onerror = function(e) {
        console.log("SoundManager.load", e);

        if (++loadedSounds === numOfSounds) cb();
      };

      xhr.send();
    });

  }

  this.playMusic = function(id, doNotloop, start) {

    if (!currentMusicBuffer) {
      var source = context.createBufferSource();
      source.buffer = buffers[id];
      source.loop = !doNotloop;
      source.connect(musicGainNode);
      
      if (!start) start = 0;
      source.start(0);

      currentMusicBuffer = source;

      console.log("SoundManager: Playing " + id);
    }
    else {
      console.log("SoundManager: Music is already playing");
    }
  }

  this.stopMusic = function() {
    if (currentMusicBuffer) {
      currentMusicBuffer.stop(0);
      currentMusicBuffer = null;
    }
  }

  this.stopAllEffects = function() {
    Object.keys(playedEffects).forEach(function(effect) {
      if (playedEffects[effect] && playedEffects[effect].source) {
        playedEffects[effect].source.stop(0);
      }
    });
  }

  this.playEffect = function(id, loop) {
    var source = context.createBufferSource();
    source.buffer = buffers[id];
    source.connect(effectGainNode);

    if (loop) source.loop = true;

    source.start(0);
    console.log("Playing effect " + id);

    playedEffects[id] = {
      source: source
    }

    lastEffectSource = source;
  }

  this.stopEffect = function(id) {
    if (this.isOrGoingToPlayEffect(id)) {
      playedEffects[id].source.stop(0);
      playedEffects[id] = null;
    }
  }

  this.isPlayingMusic = function() {
    return currentMusicBuffer && currentMusicBuffer.playbackState === 2;
  }

  this.isPlayinfEffect = function() {
    if (lastEffectSource && lastEffectSource.playbackState === 2) {      
      return true;
    }

    return false;
  }

  this.isOrGoingToPlayEffect = function(id) {
    return playedEffects[id] && playedEffects[id].source.playbackState !== 3;
  }

  this.toggleMute = function() {
    isMuted = !isMuted;
    console.log("toggleMute", isMuted);

    if (isMuted) {
      musicGainNode.gain.value = 0;
      effectGainNode.gain.value = 0;
    }
    else {
      musicGainNode.gain.value = 0.5;
      effectGainNode.gain.value = 0.5;
    }
  }
}

window.SoundManager = new SoundManager();
