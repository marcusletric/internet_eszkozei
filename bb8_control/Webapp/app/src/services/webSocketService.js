bb8_control.service('webSocketService', function($q){
  var self = this;
  var alive = false;
  var reconnecting = false;
  var socketServer;

  socketServer = new WebSocket("ws://127.0.0.1:9001");

  socketServer.onopen = function (event) {
    alive = true;
    reconnecting = false;
  };

  /*socketServer.onmessage = function (event) {
    var data = angular.fromJson(event.data);
    listeners[data.listener] && listeners[data.listener].length > 0 && listeners[data.listener].forEach(function(listener){
      listener(data.data);
    });
  };*/

  socketServer.onclose = function(event){
    alive = false;
  };

  socketServer.onerror = function(event){
    reconnecting = false;
  };

  this.postCommand = function (command,arguments){
    if(!alive){
      if(!reconnecting){
        reconnecting = true;
        self.connect().then(function(){
          self.reconnect();
        });
      }
      return false;
    }
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    var msg = {
      command: command,
      arguments: arguments
    };

    socketServer && socketServer.send(JSON.stringify(msg));

  }
});
