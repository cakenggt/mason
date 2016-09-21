module.exports = function(options){
  return `{
  "main": "index.js",
  "scripts": {
    "start": "webpack -p && node index.js",
    "build": "webpack -p",
    "watch": "webpack -d --watch"
  },
  "dependencies": {
    "babel-loader": "^6.2.5",
    "babel-polyfill": "^6.13.0",
    "babel-preset-es2015": "^6.13.2",
    "babel-preset-react": "^6.11.1",
    "body-parser": "^1.15.2",
    "express": "^4.14.0",
    "react": "^15.3.1",
    "react-dom": "^15.3.1",
    "react-router": "^2.7.0",${options.db}
    "webpack": "^1.13.2"
  }
}`;
};
