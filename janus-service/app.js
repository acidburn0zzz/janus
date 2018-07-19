'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing
var janus = require("./janus.js");
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');

var swaggerconfig = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(swaggerconfig, async (err, swaggerExpress) => {
  if (err) { throw err; }

  janus.init();
  janus.startHdwallet();

  // install middleware
  swaggerExpress.register(app);
  //app.use(swaggerExpress.runner.swaggerTools.swaggerUi());
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  var port = process.env.PORT || 10000;
  app.listen(port);

  console.log("Janus and Hdwallet for", process.env['COMPANY_NAME'], "is initialized");

  //console.log('try this:\nhttp://localhost:' + port + '/swagger');
  console.log("Listening at port", port);
});


