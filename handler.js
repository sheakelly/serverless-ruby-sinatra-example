'use strict';

var spawn = require('child_process').spawn;

var invokeRubyApp = "./ruby-bin/rack_adapter";

module.exports.execute = (event, context, callback) => {

  console.log("Starting process: " + invokeRubyApp);
  var child = spawn(invokeRubyApp, [JSON.stringify(event, null, 2), JSON.stringify(context, null, 2)]);

  child.stdout.on('data', function (data) { console.log("stdout:\n"+data); });
  child.stderr.on('data', function (data) { console.log("stderr:\n"+data); });

  child.on('close', function (code) {
    if(code !== 0) {
      context.fail("Process \"" + invokeRubyApp + "\" exited with code: " + code);
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event
      })
    };

    callback(null, response);
  });
};
