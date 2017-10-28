var sphero = require("sphero");

var bb8 = null;
var bb8conn = false;
var commandInProgress = false;
var setHeading = null;
var lastHeading = null;

function bb8_control() {
  function commandCallback() {
    commandInProgress = false;
  }

  this.connect = function() {
    console.log('Connecting BB8');
    bb8 = sphero("f6115d5e33ea4eb8b0c0aa9c30e31269");
    bb8.connect(function() {
      console.log('Connection alive');
      bb8conn = true;
      bb8.color('green');
    });
  };

  this.disconnect = function () {
    if(bb8) {
      bb8.disconnect(function() {
        console.log('Disconnected');
        bb8conn = false;
      });
    }
  };

  this.postCommand = function (command, data) {
    if (this[command]) {
      this[command]();
      return;
    }

    if (!commandInProgress) {
      var args = data;
      args.push(commandCallback);
      bb8[command].apply(bb8,args);
      commandInProgress = true;
    }
  };
}

module.exports = new bb8_control();
