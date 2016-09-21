var fs = window.require('fs');
var dialog = window.require('electron').remote.dialog;
var Handlebars = require('handlebars');

export var generate = function(state){
  console.log('generating stubs with state', state);
  generatePackage(state);
  generateModels(state);
  generateApi(state);
  generateIndexJs(state);
  generateConfigs(state);
  generateApp(state);
  generatePublic(state);
};

function generatePackage(state){
  var db = '';
  if (state.dbExists){
    switch(state.db){
      case 'PostgreSQL':
        db = `"pg": "^6.1.0",`;
        break;
      case 'SQLite':
        db = `"sqlite": "^2.2.0",`;
        break;
    }
  }

  readFile('templates/package.json', function(err, data){
    writeFile(
      state.location+'/package.json',
      Handlebars.compile(data)({
        state: state,
        db: db
      })
    );
  });
}

function generateModels(state){
  if (state.dbExists){
    readFile('templates/models.js', function(err, data){
      writeFile(
        state.location+'/models.js',
        Handlebars.compile(data)()
      );
    });
  }
}

function generateApi(state){
  if (state.apiExists){
    mkDir(state.location+'/api', function(err){
      readFile('templates/v1.js', function(err, data){
        writeFile(
          state.location+'/api/v1.js',
          Handlebars.compile(data)({
            state: state
          })
        );
      });
    });
  }
}

function generateIndexJs(state){
  var db = state.dbUrlType === 'ENV' ?
  'process.env.'+state.dbPath : `"${state.dbPath}"`;
  var port = state.portType === 'ENV' ?
    'process.env.'+state.port : `${state.port}`;

  readFile('templates/index.js', function(err, data){
    writeFile(
      state.location+'/index.js',
      Handlebars.compile(data)({
        db: db,
        port: port,
        state: state
      })
    );
  });
}

function generateConfigs(state){
  readFile('templates/webpack.config.js', function(err, data){
    writeFile(
      state.location+'/webpack.config.js',
      Handlebars.compile(data)()
    );
  });
  readFile('templates/.babelrc', function(err, data){
    writeFile(
      state.location+'/.babelrc',
      Handlebars.compile(data)()
    );
  });
  readFile('templates/.gitignore', function(err, data){
    writeFile(
      state.location+'/.gitignore',
      Handlebars.compile(data)()
    );
  });
}

function generateApp(state){
  mkDir(state.location+'/app', function(err){
    readFile('templates/index.jsx', function(err, data){
      writeFile(
        state.location+'/app/index.jsx',
        Handlebars.compile(data)()
      );
    });
  });
}

function generatePublic(state){
  mkDir(state.location+'/public', function(err){
    mkDir(state.location+'/public/html', function(err){
      readFile('templates/index.html', function(err, data){
        writeFile(
          state.location+'/public/html/index.html',
          Handlebars.compile(data)()
        );
      });
    });
    mkDir(state.location+'/public/css', function(err){
      readFile('templates/stylesheet.css', function(err, data){
        writeFile(
          state.location+'/public/css/stylesheet.css',
          Handlebars.compile(data)()
        );
      });
    });
    mkDir(state.location+'/public/js');
  });
}

function mkDir(path, callback){
  fs.mkdir(path, function(err){
    if (err){
      dialog.showErrorBox('Error', `Error creating ${path}
Folder probably already exists
${JSON.stringify(err)}`);
    }
    if (callback){
      callback(err);
    }
  });
}

function writeFile(path, file, callback){
  fs.writeFile(path, file, function(err){
    if (err){
      dialog.showErrorBox('Error', `Error creating ${path}
${JSON.stringify(err)}`);
    }
    if (callback){
      callback(err);
    }
  });
}

function readFile(path, callback){
  fs.readFile(path, 'utf8', function(err, data){
    if (err){
      dialog.showErrorBox('Error', `Error reading ${path}
${JSON.stringify(err)}`);
    }
    if (callback){
      callback(err, data);
    }
  });
}
