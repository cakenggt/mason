import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
{{#if state.reduxExists}}
import {Provider, connect} from 'react-redux';
import {createStore} from 'redux';
{{/if}}
{{#if state.socketExists}}
var socket = io.connect('');
{{/if}}

{{#if state.reduxExists}}
var reducer = function(state = {}, action){
  switch (action.type){
    default:
      return state;
  }
};

var store = createStore(reducer);
{{/if}}

{{#unless state.reduxExists}}
var App = React.createClass({
  render: function() {
    return (
      <div className="content">
        {React.Children.map(this.props.children, child => {
          return React.cloneElement(child, {
            data: this.state
          });
        })}
      </div>
    );
  }
});
{{/unless}}

var Index = {{#if state.reduxExists}}connect()({{/if}}React.createClass({
  render: function() {
    return (
      <div></div>
    );
  }
}){{#if state.reduxExists}}){{/if}};

var router = (
  <Router history={browserHistory}>
    <Route path="/" {{#unless state.reduxExists}}component={App}{{/unless}}>
      <IndexRoute component={Index}/>
    </Route>
  </Router>
);

render(
  {{#if state.reduxExists}}
  <Provider store={store}>{router}</Provider>,
  {{else}}
  router,
  {{/if}}
  document.getElementById('app')
);
