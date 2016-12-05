import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';
{{#if state.reduxExists}}
import {Provider, connect} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import dataReducer from './reducers/dataReducer.js';
import {loadData} from './actionCreators/dataActions.js';
{{/if}}
{{#if state.socketExists}}
var socket = io.connect('');
{{/if}}

{{#if state.reduxExists}}
var reducer = combineReducers({
  data: dataReducer
});

var store = createStore(
  reducer,
  applyMiddleware(thunk)
);
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

var mapStateToProps = (state) => {
  return {
    data: state.data
  }
}

var mapDispatchToProps = (dispatch) => {
  return {
    loadData: function(newData){
      dispatch(loadData(newData));
    }
  }
}

var Index = {{#if state.reduxExists}}connect(
  mapStateToProps,
  mapDispatchToProps
)({{/if}}React.createClass({
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
