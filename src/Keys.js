var Keys = {
  install: function() {
    window.addEventListener('keydown', function(event) {  
      Keys['prop_' + event.keyCode] = true;
    }, false);

    window.addEventListener('keyup', function(event) {  
      Keys['prop_' + event.keyCode] = false;
    }, false);

    window.Keys = Keys;

    console.log("Keyboard listener installed.");
  },

  isKeyDown: function(keyCode) {
    return Keys['prop_' + keyCode];
  },

};   
