var fs = require('fs');
var Handlebars = require('handlebars');

exports.generate = function(state, options){
  generatePackage(state, options);
  generateModels(state, options);
  generateApi(state, options);
  generateSockets(state, options);
  generateIndexJs(state, options);
  generateConfigs(state, options);
  generateApp(state, options);
  generatePublic(state, options);
};

function generatePackage(state, options){
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

  readFile(options.pkgDir+'/templates/package.json', options.error, function(err, data){
    writeFile(
      state.location+'/package.json',
      Handlebars.compile(data)({
        state: state,
        db: db
      }),
      options.error
    );
  });
}

function generateModels(state, options){
  if (state.dbExists){
    readFile(options.pkgDir+'/templates/models.js', options.error, function(err, data){
      writeFile(
        state.location+'/models.js',
        Handlebars.compile(data)(),
        options.error
      );
    });
  }
}

function generateApi(state, options){
  if (state.apiExists){
    mkDir(state.location+'/api', options.error, function(err){
      readFile(options.pkgDir+'/templates/v1.js', options.error, function(err, data){
        writeFile(
          state.location+'/api/v1.js',
          Handlebars.compile(data)({
            state: state
          }),
          options.error
        );
      });
    });
  }
}

function generateSockets(state, options){
  if (state.socketExists){
    readFile(options.pkgDir+'/templates/sockets.js', options.error, function(err, data){
      writeFile(
        state.location+'/sockets.js',
        Handlebars.compile(data)({
          state: state
        }),
        options.error
      );
    });
  }
}

function generateIndexJs(state, options){
  var db = state.dbUrlType === 'ENV' ?
  'process.env.'+state.dbPath : `"${state.dbPath}"`;
  var port = state.portType === 'ENV' ?
    'process.env.'+state.port : `${state.port}`;

  readFile(options.pkgDir+'/templates/index.js', options.error, function(err, data){
    writeFile(
      state.location+'/index.js',
      Handlebars.compile(data)({
        db: db,
        port: port,
        state: state
      }),
      options.error
    );
  });
}

function generateConfigs(state, options){
  if (state.frontEndExists){
    readFile(options.pkgDir+'/templates/webpack.config.js', options.error, function(err, data){
      writeFile(
        state.location+'/webpack.config.js',
        Handlebars.compile(data)(),
        options.error
      );
    });
    readFile(options.pkgDir+'/templates/.babelrc', options.error, function(err, data){
      writeFile(
        state.location+'/.babelrc',
        Handlebars.compile(data)(),
        options.error
      );
    });
  }
  readFile(options.pkgDir+'/templates/.gitignore-file', options.error, function(err, data){
    writeFile(
      state.location+'/.gitignore',
      Handlebars.compile(data)(),
      options.error
    );
  });
}

function generateApp(state, options){
  if (state.frontEndExists){
    mkDir(state.location+'/app', options.error, function(err){
      readFile(options.pkgDir+'/templates/index.jsx', options.error, function(err, data){
        writeFile(
          state.location+'/app/index.jsx',
          Handlebars.compile(data)({
            state: state
          }),
          options.error
        );
      });
    });
  }
}

function generatePublic(state, options){
  if (state.frontEndExists){
    mkDir(state.location+'/public', options.error, function(err){
      mkDir(state.location+'/public/html', options.error, function(err){
        readFile(options.pkgDir+'/templates/index.html', options.error, function(err, data){
          writeFile(
            state.location+'/public/html/index.html',
            Handlebars.compile(data)({
              state: state
            }),
            options.error
          );
        });
      });
      mkDir(state.location+'/public/css', options.error, function(err){
        readFile(options.pkgDir+'/templates/stylesheet.css', options.error, function(err, data){
          writeFile(
            state.location+'/public/css/stylesheet.css',
            Handlebars.compile(data)(),
            options.error
          );
        });
      });
      mkDir(state.location+'/public/js', options.error);
    });
  }
}

function mkDir(path, errorFunc, callback){
  fs.mkdir(path, function(err){
    if (err){
      errorFunc(`Error creating ${path}
Folder probably already exists
${JSON.stringify(err)}`);
    }
    if (callback){
      callback(err);
    }
  });
}

function writeFile(path, file, errorFunc, callback){
  fs.writeFile(path, file, function(err){
    if (err){
      errorFunc(`Error creating ${path}
${JSON.stringify(err)}`);
    }
    if (callback){
      callback(err);
    }
  });
}

function readFile(path, errorFunc, callback){
  fs.readFile(path, 'utf8', function(err, data){
    if (err){
      errorFunc(`Error reading ${path}
${JSON.stringify(err)}`);
    }
    if (callback){
      callback(err, data);
    }
  });
}
