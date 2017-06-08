'use strict';

var spawn = require('child_process').spawn;

module.exports.handler = (event, context, callback) => {

  console.log(JSON.stringify(event, null, 2));
  console.log(JSON.stringify(context, null, 2));

  var proc = spawn('./ruby-bin/rack_adapter.sh', [JSON.stringify(event, null, 2), JSON.stringify(context, null, 2)]);

  var response = '';

  proc.stdout.on('data', function (data) {
    response += data;
  });

  proc.stdout.on('error', function (data) {
    response += data;
  });

  var errorMessage = '';

  proc.stderr.on('data', function (data) {
    errorMessage += data;
  });

  proc.stderr.on('error', function (data) {
    errorMessage += data;
  });

  proc.on('close', (code) => {
    if (errorMessage.length != 0) {
      console.log("An error occurred: " + errorMessage);
      context.succeed({statusCode: 500, body: errorMessage});
    } else {
      console.log("Success: " + response);
      context.succeed(JSON.parse(response));
    }
  });
};
