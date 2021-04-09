const jwt = require("jsonwebtoken");

exports.PUBLIC_KEY = require("fs").readFileSync(
  "./keys/jwtRS256.key.pub",
  "utf8"
);
exports.PRIVATE_KEY = require("fs").readFileSync("./keys/jwtRS256.key", "utf8");
exports.jwt = function (payload) {
  return jwt.sign(payload, exports.PRIVATE_KEY, { algorithm: "RS256" });
};
