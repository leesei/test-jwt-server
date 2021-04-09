#!/bin/env node

const Hapi = require("@hapi/hapi");
const Glob = require("glob");
const Joi = require("joi");
const Qs = require("qs");
const parseArgs = require("minimist");

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    p: "port",
  },
  default: {
    port: 8000,
  },
  "--": true,
});
// console.log(argv); process.exit(0);

const init = async () => {
  const server = new Hapi.Server({
    host: "0.0.0.0",
    port: argv.port,
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === "production") {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error("ValidationError:", err.message);
            throw Boom.badRequest(`Invalid request payload input`);
          } else {
            // During development, log and respond with the full error.
            console.error(err);
            throw err;
          }
        },
      },
    },
  });
  server.validator(Joi);

  // add routes
  Glob.sync("./routes/*.js", { cwd: __dirname }).forEach(function (ith) {
    const routes = require("./" + ith);
    for (var route of routes) {
      if (route.hasOwnProperty("method") && route.hasOwnProperty("path")) {
        console.log("Adding route:", route.method, route.path);
        server.route(route);
      }
    }
  });

  await server.start();
  console.log("Server running at:", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
