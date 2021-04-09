const Decode = require("../decode");

module.exports = [
  {
    method: "GET",
    path: "/verify/{jwt}",
    handler: function (request, h) {
      return Decode.verify(request.payload);
    },
    config: {
      description: "verify a JWT",
    },
  },
  {
    method: "POST",
    path: "/verify",
    handler: function (request, h) {
      return Decode.verify(request.payload);
    },
    config: {
      description: "decode a JWT",
    },
  },
];
