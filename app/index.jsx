import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory, withRouter} from 'react-router';
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
      port: 'PORT',
      dbExists: true,
      apiExists: true,
      frontEndExists: true
    };
  },
  render: function() {
    return (
      <div
        className="content">
        <IndexLink
          to="/">
          <h1>
            Mason
          </h1>
        </IndexLink>
        <div>
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
          <span
            className="btn fright">Next</span>
        </Link>
      );
    }
    var locationBox = this.props.data.location ?
    <div
      className="display">
      {this.props.data.location}
    </div> : null;
    return (
      <div>
        <h2>Project Location</h2>
        {locationBox}
        <span
          onClick={this.openFolder}
          className="btn">Open Folder</span>
        <div
          className="nav">
          {nextLink}
        </div>
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
          <div
            className="option-row">
            <span
              className="label">
              Has API?
            </span>
            <label className="switch fright">
              <input
                type="checkbox"
                checked={this.props.data.apiExists}
                onChange={this.changeAPIExists}/>
              <div className="slider round"></div>
            </label>
          </div>
          <div
            className="option-row">
            <span
              className="label">Port Type</span>
            <select
              onChange={this.changePortType}
              value={this.props.data.portType}
              className="fright">
              <option
                value="ENV">Environment Variable</option>
              <option
                value="NUMBER">Hard Coded Number</option>
            </select>
          </div>
          <div
            className="option-row">
            <span
              className="label">Port</span>
              <input
                type={inputType}
                value={this.props.data.port}
                onChange={this.changePort}
                className="fright"/>
          </div>
        </div>
        <div
          className="nav">
          <Link to="/database">
            <span
              className="btn fleft">Back</span>
          </Link>
          <Link to="/display">
            <span
              className="btn fright">Next</span>
          </Link>
        </div>
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
  },
  changeAPIExists: function(e){
    this.props.setMainState({apiExists: e.target.checked});
  }
});

var DatabaseElement = React.createClass({
  propTypes: {
    setMainState: React.PropTypes.func
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
    var optionsHidden = this.props.data.dbExists ?
      'collapse' : 'collapse hidden';
    return (
      <div>
        <h2>Database</h2>
        <div
          className="option-row">
          <span
            className="label">
            Database Support?
          </span>
          <label className="switch fright">
            <input
              type="checkbox"
              checked={this.props.data.dbExists}
              onChange={this.changeDbExists}/>
            <div className="slider round"></div>
          </label>
        </div>
        <div
          className={optionsHidden}>
          <div
            className="option-row">
            <span
              className="label">Select your database</span>
            <select
              onChange={this.selectDb}
              value={this.props.data.db}
              className="fright">
              {databaseOptions}
            </select>
          </div>
          <div>
            <h3>Database Credentials</h3>
            <div
              className="option-row">
              <span
                className="label">Type</span>
              <select
                onChange={this.changeType}
                value={this.props.data.dbUrlType}
                className="fright">
                <option
                  value="ENV">Environment Variable</option>
                <option
                  value="URL">Hard Coded URL</option>
              </select>
            </div>
            <div
              className="option-row">
              <span
                className="label">Path</span>
                <input
                  type="text"
                  value={this.props.data.dbPath}
                  onChange={this.changePath}
                  className="fright"/>
            </div>
          </div>
        </div>
        <div
          className="nav">
          <Link to="/">
            <span
              className="btn fleft">Back</span>
          </Link>
          <Link to="/server">
            <span
              className="btn fright">Next</span>
          </Link>
        </div>
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
  },
  changeDbExists: function(e){
    this.props.setMainState({dbExists: e.target.checked});
  }
});

var SummaryElement = React.createClass({
  render: function(){
    return (
      <div>
        <h2>Summary</h2>
        <p>
          Congratulations! Your project is now located at
          {this.props.data.location}
        </p>
        <h2>Next Steps</h2>
        <p>
          Run <code>npm init</code> in <code>{this.props.data.location}</code> to
          initialize additional project properties.
        </p>
        <p>
          Run <code>npm install</code> to install all dependencies.
        </p>
        <p>
          Run <code>npm start</code> to start your server.
        </p>
      </div>
    )
  }
});

var DisplayElement = withRouter(React.createClass({
  propTypes: {
    setMainState: React.PropTypes.func,
    router: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    }).isRequired
  },
  render: function(){
    return (
      <div>
        <h2>Display</h2>
        <div
          className="option-row">
          <span
            className="label">
            Has front-end?
          </span>
          <label className="switch fright">
            <input
              type="checkbox"
              checked={this.props.data.frontEndExists}
              onChange={this.changeFrontEndExists}/>
            <div className="slider round"></div>
          </label>
        </div>
        <div
          className="nav">
          <Link to="/server">
            <span
              className="btn fleft">Back</span>
          </Link>
          <span
            onClick={this.generate}
            className="btn fright">Generate!</span>
        </div>
      </div>
    )
  },
  changeFrontEndExists: function(e){
    this.props.setMainState({frontEndExists: e.target.checked});
  },
  generate: function(){
    this.props.generate();
    this.props.router.push('/summary');
  }
}));

render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={LocationElement}/>
      <Route path="database" component={DatabaseElement}/>
      <Route path="server" component={ServerElement}/>
      <Route path="display" component={DisplayElement}/>
      <Route path="summary" component={SummaryElement}/>
    </Route>
  </Router>,
  document.getElementById('app'));
