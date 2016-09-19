var fs = window.require('fs');

export var generate = function(state){
  console.log('generating stubs');
  generatePackage(state);
};

function generatePackage(state){
  var packageJsonLocation = state.location+'/package.json';
  var packageJson = {
    "dependencies": {
      "babel-loader": "^6.2.5",
      "babel-polyfill": "^6.13.0",
      "babel-preset-es2015": "^6.13.2",
      "babel-preset-react": "^6.11.1",
      "body-parser": "^1.15.2",
      "express": "^4.14.0",
      "react": "^15.3.1",
      "react-dom": "^15.3.1",
      "react-router": "^2.7.0",
      "sequelize": "^3.24.1",
      "webpack": "^1.13.2"
    }
  };
  switch(state.db){
    case 'PostgreSQL':
      packageJson.dependencies.pg = "^6.1.0";
      break;
    case 'SQLite':
      packageJson.dependencies.sqlite = "^2.2.0";
      break;
  }
  fs.writeFile(packageJsonLocation, JSON.stringify(packageJson));
  console.log('wrote file to', packageJsonLocation);
}
