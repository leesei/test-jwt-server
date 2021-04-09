const Decode = require("../decode");

module.exports = [
  {
    method: "GET",
    path: "/decode/{jwt}",
    handler: function (request, h) {
      return Decode.decode(request.params.jwt);
    },
    config: {
      description: "decode a JWT",
    },
  },
  {
    method: "POST",
    path: "/decode",
    handler: function (request, h) {
      return Decode.decode(request.payload);
    },
    config: {
      description: "decode a JWT",
    },
  },
];
