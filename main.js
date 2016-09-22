
var options = require('yargs').argv;

if (options.D){
  console.log('Starting in dev-mode with electron-reload support!');
  require('electron-reload')(__dirname, {
    electron: require('electron-prebuilt')
  });
}

var win;

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});
app.on('ready', function() {
  win = new BrowserWindow({width: 800, height: 700});
  win.loadURL('file://' + __dirname + '/public/html/index.html');
  if (options.D){
    win.openDevTools();
  }
  win.on('closed', function() {
    mainWindow = null;
  });
});
