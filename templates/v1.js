'use strict';
const prefix = '/api/v1/';

module.exports = function(options){

  //This is your express app object
  let app = options.app;
  {{#if state.dbExists}}
  //This is the map of all of your sequelize models
  let models = options.models;
  {{/if}}

  /**
   * All of your api routes go here.
   * Format them in the following way:
   * app.post(prefix+'endpoint', callback);
   * app.get(prefix+'endpoint', callback);
   */

};
