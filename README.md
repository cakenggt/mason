# Stonemason

Stonemason is an app for creating microservice stubs. Enabling all of the options will allow a webservice to be generated with db support through sequelize, a working api, and a React.js front-end complete with webpack settings and build/watch scripts. Additionally, stubs will be created for the models and api routes.

The purpose of Stonemason is to enable developers to get up and running as quickly as possible if they are using this very specific stack for a webservice. There are better tools out there for building a wider range of services, but the specificity of Stonemason allows much of the additional boilerplate code to be generated automatically.

## Usage

Install Stonemason globally using npm

`npm install -g stonemason`

Calling it from the command line will start the electron app

`stonemason`

The idea of the app is that at the end of the generation process, you should be able to just perform `npm install` and then be able to run `npm start` to have a working server running, complete with the files necessary to build out your api, react, and db model stubs.

Additionally, a cli is provided. Navigate to the folder where you want your app to reside (or choose it's location during the question process), and run

`stonemason-cli`

and answer a few questions about your app to generate the server.
