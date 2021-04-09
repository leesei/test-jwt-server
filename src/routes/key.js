const Secret = require("../secret");
const Rsa = require("../rsa");

module.exports = [
  {
    method: "GET",
    path: "/key.secret",
    handler: function (request, h) {
      return Secret.SHARED_SECRET;
    },
    config: {
      description: "get shared secret",
    },
  },
  {
    method: "GET",
    path: "/key.public",
    handler: function (request, h) {
      return Rsa.PUBLIC_KEY;
    },
    config: {
      description: "get RSA public key",
    },
  },
  {
    method: "GET",
    path: "/key.private",
    handler: function (request, h) {
      return Rsa.PRIVATE_KEY;
    },
    config: {
      description: "get RSA private key",
    },
  },
];
