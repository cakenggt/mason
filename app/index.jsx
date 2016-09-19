import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory} from 'react-router';
import {render} from 'react-dom';
const {dialog} = window.require('electron').remote;

var App = React.createClass({
  getInitialState: function() {
    return {
      location: ''
    };
  },
  render: function() {
    return (
      <div>
        <h1>
          Mason
        </h1>
        <div className="content">
          {React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
              data: this.state,
              setMainState: this.setMainState
            });
          })}
        </div>
      </div>
    );
  },
  setMainState: function(state){
    console.log('got to set main state');
    this.setState(state);
  }
});

var LocationElement = React.createClass({
  propTypes: {
    setMainState: React.PropTypes.func,
  },
  render: function(){
    return (
      <div>
        <div>
          {this.props.data.location}
        </div>
        <span
          onClick={this.openFolder}>Open Folder</span>
      </div>
    )
  },
  openFolder: function(){
    dialog.showOpenDialog({
      properties: [
        `openDirectory`, 'createDirectory'
      ]
    }, directory => {
      if (directory){
        this.props.setMainState({location: directory});
      }
    });
  }
});

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LocationElement}/>
    </Route>
  </Router>,
  document.getElementById('app'));
