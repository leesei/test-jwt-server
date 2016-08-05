#!/bin/env node

const Url = require('url');
const Hapi = require('hapi');
const parseArgs = require('minimist');

const Payload = require('./payload');
const Secret = require('./secret');
const Rsa = require('./rsa');
const Decode = require('./decode');

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    'p': 'port'
  },
  default: {
    port: 8000
  },
  '--': true
});
// console.log(argv); process.exit(0);

const server = new Hapi.Server();
server.connection({
  host: '0.0.0.0',
  port: argv.port
});

server.route({
  method: 'GET',
  path:'/payload',
  handler: function (request, reply) {
    return reply(Payload.parse(request.query));
  },
  config: {
    description: 'preview payload specified with querystring (https://github.com/ljharb/qs)',
    validate: {
      query: Payload.validate
    }
  }
});

server.route({
  method: 'POST',
  path:'/payload',
  handler: function (request, reply) {
    return reply(Payload.parse(request.payload));
  },
  config: {
    description: 'preview payload in request body',
    validate: {
      payload: Payload.validate
    }
  }
});

server.route({
  method: 'GET',
  path:'/jwt',
  handler: function (request, reply) {
    return reply(Secret.jwt(Payload.parse(request.query)));
  },
  config: {
    description: 'get JWT signed with shared secret',
    validate: {
      query: Payload.validate
    }
  }
});

server.route({
  method: 'POST',
  path:'/jwt',
  handler: function (request, reply) {
    return reply(Secret.jwt(Payload.parse(request.payload)));
  },
  config: {
    description: 'get JWT signed with shared secret',
    validate: {
      payload: Payload.validate
    }
  }
});

server.route({
  method: 'GET',
  path:'/jwt.salted',
  handler: function (request, reply) {
    return reply(Secret.jwt_salted(Payload.parse(request.query)));
  },
  config: {
    description: 'get JWT signed with shared secret (with salt)',
    validate: {
      query: Payload.validate
    }
  }
});

server.route({
  method: 'POST',
  path:'/jwt.salted',
  handler: function (request, reply) {
    return reply(Secret.jwt_salted(Payload.parse(request.payload)));
  },
  config: {
    description: 'get JWT signed with shared secret (with salt)',
    validate: {
      payload: Payload.validate
    }
  }
});

server.route({
  method: 'GET',
  path:'/jwt.rsa',
  handler: function (request, reply) {
    return reply(Rsa.jwt(Payload.parse(request.query)));
  },
  config: {
    description: 'get JWT signed with RSA key',
    validate: {
      query: Payload.validate
    }
  }
});

server.route({
  method: 'POST',
  path:'/jwt.rsa',
  handler: function (request, reply) {
    return reply(Rsa.jwt(Payload.parse(request.payload)));
  },
  config: {
    description: 'get JWT signed with RSA key',
    validate: {
      payload: Payload.validate
    }
  }
});

server.route({
  method: 'GET',
  path:'/key.shared',
  handler: function (request, reply) {
    return reply(Secret.SHARED_SECRET);
  },
  config: {
    description: 'get shared secret'
  }
});

server.route({
  method: 'GET',
  path:'/key.public',
  handler: function (request, reply) {
    return reply(Rsa.PUBLIC_KEY);
  },
  config: {
    description: 'get RSA public key'
  }
});

server.route({
  method: 'GET',
  path:'/key.private',
  handler: function (request, reply) {
    return reply(Rsa.PRIVATE_KEY);
  },
  config: {
    description: 'get RSA private key'
  }
});

server.route({
  method: 'GET',
  path:'/decode/{jwt}',
  handler: function (request, reply) {
    return reply(Decode.decode(request.params.jwt));
  },
  config: {
    description: 'decode a JWT'
  }
});

server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    // console.log(server.table());
    console.log(request.headers.host);
    const table = server.table()[0].table;

    return reply(table.map(function(route) {
      return {
        endpoint: route.method.toUpperCase() + ' ' + route.path,
        url: `http://${request.headers.host}${route.path}`,
        description: route.settings.description
      };
    }));
  },
  config: {
    description: 'list routes'
  }
});

server.register({
    register: require('hapi-qs'),
    options: {
      qsOptions: { allowDots: true }
    }
  })
.then(_ => server.start())
.then(_ => console.log('Server running at:', server.info.uri))
.catch(err => {
  console.error(err);
});
