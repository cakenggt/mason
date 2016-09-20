module.exports = function(options){
  return `import 'babel-polyfill';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {render} from 'react-dom';

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

var Index = React.createClass({
  render: function() {
    return (
      <div></div>
    );
  }
});

render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
`;
};
