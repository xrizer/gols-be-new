const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./routes');
// const https = require('https');
// const fs = require('fs');

// const options = {
//   key: fs.readFileSync('./src/key.pem'),
//   cert: fs.readFileSync('./src/cert.pem')
// };

dotenv.config();
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    //tls:options,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();