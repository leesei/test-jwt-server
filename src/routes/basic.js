module.exports = [
  {
    method: "GET",
    path: "/",
    handler: function (request, h) {
      return request.server.table().map(function (route) {
        return {
          endpoint: route.method.toUpperCase() + " " + route.path,
          url: `http://${request.headers.host}${route.path}`,
          description: route.settings.description,
        };
      });
    },
    config: {
      description: "list routes",
    },
  },
];
