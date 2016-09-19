import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory} from 'react-router';
import {render} from 'react-dom';
const {dialog} = window.require('electron').remote;
import {generate} from './generator';

var App = React.createClass({
  getInitialState: function() {
    return {
      location: '',
      db: 'PostgreSQL'
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
              setMainState: this.setMainState,
              generate: this.generate
            });
          })}
        </div>
      </div>
    );
  },
  setMainState: function(state){
    this.setState(state);
  },
  generate: function(){
    generate(this.state);
  }
});

var LocationElement = React.createClass({
  propTypes: {
    setMainState: React.PropTypes.func,
  },
  render: function(){
    var nextLink = '';
    if (this.props.data.location){
      nextLink = (
        <Link to="/database">
          <span>Next</span>
        </Link>
      );
    }
    return (
      <div>
        <h2>Project Location</h2>
        <div>
          {this.props.data.location}
        </div>
        <span
          onClick={this.openFolder}>Open Folder</span>
        {nextLink}
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

var DatabaseElement = React.createClass({
  propTypes: {
    setMainState: React.PropTypes.func,
  },
  render: function(){
    var databases = [
      'PostgreSQL',
      'SQLite'
    ];
    var databaseOptions = databases.map(function(elem, i){
      return (
        <option
          key={elem}
          value={elem}>
          {elem}
        </option>
      )
    });
    return (
      <div>
        <h2>Database</h2>
        <div>
          Select your database
          <select
            onChange={this.selectDb}
            value={this.props.data.db}>
            {databaseOptions}
          </select>
        </div>
        <Link to="/">
          <span>Back</span>
        </Link>
        <span
          onClick={this.props.generate}>Generate!</span>
      </div>
    )
  },
  selectDb: function(e){
    console.log(e.target.value);
    this.props.setMainState({db: e.target.value});
  }
});

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LocationElement}/>
      <Route path="database" component={DatabaseElement}/>
    </Route>
  </Router>,
  document.getElementById('app'));
