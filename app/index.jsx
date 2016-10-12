import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, IndexLink, Link, hashHistory, withRouter} from 'react-router';
import {render} from 'react-dom';
const {dialog} = require('electron').remote;
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
      frontEndExists: true,
      socketExists: false,
      reduxExists: false
    };
  },
  render: function() {
    return (
      <div
        className="content">
        <IndexLink
          to="/">
          <h1>
            stonemason
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
    generate(this.state, {
      error: function(msg){
        dialog.showErrorBox('Error', msg);
      }
    });
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
            <Slider
              checked={this.props.data.apiExists}
              onChange={this.changeAPIExists}
              class="fright"/>
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
          <Slider
            checked={this.props.data.dbExists}
            onChange={this.changeDbExists}
            class="fright"/>
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
    var advice = [];
    var data = this.props.data;
    if (data.apiExists || data.dbExists || data.frontEndExists){
      if (data.dbExists){
        advice.push(
          <p
            key="db">
            Place your sequelize models in <code>models.js</code>
          </p>
        );
      }
      if (data.apiExists){
        advice.push(
          <p
            key="api">
            Place your api endpoints in <code>api/v1.js</code>
          </p>
        );
      }
      if (data.frontEndExists){
        advice.push(
          <p
            key="frontEnd">
            Build out your React front-end in <code>app/index.jsx</code>
          </p>
        );
        if (data.socketExists){
          advice.push(
            <p
              key="sockets">
              Build out your sockets in <code>sockets.js</code>
            </p>
          )
        }
      }
    }
    return (
      <div>
        <h2>Summary</h2>
        <p>
          Congratulations! Your project is now located at&nbsp;
          {data.location}
        </p>
        <h2>Next Steps</h2>
        <p>
          Run <code>npm init</code> in <code>{data.location}</code> to
          initialize additional project properties.
        </p>
        <p>
          Run <code>npm install</code> to install all dependencies.
        </p>
        <p>
          Run <code>npm start</code> to start your server.
        </p>
        {advice}
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
    var optionsHidden = this.props.data.frontEndExists ?
      'collapse' : 'collapse hidden';
    return (
      <div>
        <h2>Display</h2>
        <div
          className="option-row">
          <span
            className="label">
            Has front-end?
          </span>
          <Slider
            checked={this.props.data.frontEndExists}
            onChange={this.changeFrontEndExists}
            class="fright"/>
        </div>
        <div
          className={optionsHidden}>
          <div
            className="option-row">
            <span
              className="label">
              Has redux?
            </span>
            <Slider
              checked={this.props.data.reduxExists}
              onChange={this.changeReduxExists}
              class="fright"/>
          </div>
          <div
            className="option-row">
            <span
              className="label">
              Has socket.io support?
            </span>
            <Slider
              checked={this.props.data.socketExists}
              onChange={this.changeSocketExists}
              class="fright"/>
          </div>
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
  changeSocketExists: function(e){
    this.props.setMainState({socketExists: e.target.checked});
  },
  changeReduxExists: function(e){
    this.props.setMainState({reduxExists: e.target.checked});
  },
  generate: function(){
    this.props.generate();
    this.props.router.push('/summary');
  }
}));

var Slider = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    checked: React.PropTypes.bool.isRequired,
    class: React.PropTypes.string
  },
  render: function(){
    var labelClass = 'switch ' + this.props.class;
    return (
      <label
        className={labelClass}>
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}/>
        <div className="slider round"></div>
      </label>
    );
  }
});

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
