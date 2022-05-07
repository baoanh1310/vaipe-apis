const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'VAIPE API',
    description: 'VAIPE API',
  },
  host: 'localhost:5656',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/auth.routes.js','./routes/blood.routes.js', './routes/ecg.routes.js', './routes/oxy.routes.js',
  './routes/prescription.routes.js',  './routes/temperature.routes.js',  './routes/user.routes.js',  './routes/weight.routes.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);
