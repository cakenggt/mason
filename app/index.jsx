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
      db: 'PostgreSQL',
      dbUrlType: 'ENV',
      dbPath: 'DATABASE_URL',
      portType: 'ENV',
      port: 'PORT'
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
        <Link to="/server">
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

var ServerElement = React.createClass({
  propTypes: {
    setMainState: React.PropTypes.func,
  },
  render: function(){
    var inputType = this.props.data.portType === 'ENV' ?
      'text' : 'number';
    return (
      <div>
        <h2>Server</h2>
        <div>
          <h3>Server Options</h3>
          Port Type
          <select
            onChange={this.changePortType}
            value={this.props.data.portType}>
            <option
              value="ENV">Environment Variable</option>
            <option
              value="NUMBER">Hard Coded Number</option>
          </select><br/>
          Port
          <input
            type={inputType}
            value={this.props.data.port}
            onChange={this.changePort}/>
        </div>
        <Link to="/">
          <span>Back</span>
        </Link>
        <Link to="/database">
          <span>Next</span>
        </Link>
      </div>
    )
  },
  selectDb: function(e){
    this.props.setMainState({db: e.target.value});
  },
  changePortType: function(e){
    this.props.setMainState({portType: e.target.value});
  },
  changePort: function(e){
    this.props.setMainState({port: e.target.value});
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
        <div>
          <h3>Database Credentials</h3>
          Type
          <select
            onChange={this.changeType}
            value={this.props.data.dbUrlType}>
            <option
              value="ENV">Environment Variable</option>
            <option
              value="URL">Hard Coded URL</option>
          </select><br/>
          Path
          <input
            type="text"
            value={this.props.data.dbPath}
            onChange={this.changePath}/>
        </div>
        <Link to="/server">
          <span>Back</span>
        </Link>
        <span
          onClick={this.props.generate}>Generate!</span>
      </div>
    )
  },
  selectDb: function(e){
    this.props.setMainState({db: e.target.value});
  },
  changeType: function(e){
    this.props.setMainState({dbUrlType: e.target.value});
  },
  changePath: function(e){
    this.props.setMainState({dbPath: e.target.value});
  }
});

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LocationElement}/>
      <Route path="server" component={ServerElement}/>
      <Route path="database" component={DatabaseElement}/>
    </Route>
  </Router>,
  document.getElementById('app'));
