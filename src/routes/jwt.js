const Payload = require("../payload");
const Secret = require("../secret");
const Rsa = require("../rsa");

module.exports = [
  {
    method: "GET",
    path: "/jwt.secret",
    handler: function (request, h) {
      return Secret.jwt(Payload.parse(request.query));
    },
    config: {
      description: "get JWT signed with shared secret",
      validate: {
        query: Payload.schema,
      },
    },
  },
  {
    method: "POST",
    path: "/jwt.secret",
    handler: function (request, h) {
      return Secret.jwt(Payload.parse(request.payload));
    },
    config: {
      description: "get JWT signed with shared secret",
      validate: {
        payload: Payload.schema,
      },
    },
  },
  {
    method: "GET",
    path: "/jwt.secret+salt",
    handler: function (request, h) {
      return Secret.jwt_salted(Payload.parse(request.query));
    },
    config: {
      description: "get JWT signed with shared secret (with salt)",
      validate: {
        query: Payload.schema,
      },
    },
  },
  {
    method: "POST",
    path: "/jwt.secret+salt",
    handler: function (request, h) {
      return Secret.jwt_salted(Payload.parse(request.payload));
    },
    config: {
      description: "get JWT signed with shared secret (with salt)",
      validate: {
        payload: Payload.schema,
      },
    },
  },
  {
    method: "GET",
    path: "/jwt.rsa",
    handler: function (request, h) {
      return Rsa.jwt(Payload.parse(request.query));
    },
    config: {
      description: "get JWT signed with RSA key",
      validate: {
        query: Payload.schema,
      },
    },
  },
  {
    method: "POST",
    path: "/jwt.rsa",
    handler: function (request, h) {
      return Rsa.jwt(Payload.parse(request.payload));
    },
    config: {
      description: "get JWT signed with RSA key",
      validate: {
        payload: Payload.schema,
      },
    },
  },
];
