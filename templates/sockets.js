'use strict';

module.exports = function(options){

  //This is your express app object
  let app = options.app;
  {{#if state.dbExists}}
  //This is the map of all of your sequelize models
  let models = options.models;
  {{/if}}

  //This is the io object that we will listen for connections to
  const io = require('socket.io')(app);

  io.on('connection', function(socket) {
    /*
     * This is where your socket listeners will go
     */
  });
};
