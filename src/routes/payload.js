const Payload = require("../payload");

module.exports = [
  {
    method: "GET",
    path: "/payload",
    handler: function (request, h) {
      return Payload.parse(request.query);
    },
    config: {
      description:
        "preview payload specified with querystring (https://github.com/ljharb/qs)",
      validate: {
        query: Payload.schema,
      },
    },
  },
  {
    method: "POST",
    path: "/payload",
    handler: function (request, h) {
      return Payload.parse(request.payload);
    },
    config: {
      description: "preview payload in request body",
      validate: {
        payload: Payload.schema,
      },
    },
  },
];
