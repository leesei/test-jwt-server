const jwt = require("jsonwebtoken");
const Secret = require("./secret");
const Rsa = require("./rsa");

/**
 *
 * @param {string} token
 * @returns {Object}
 */
exports.decode = function (token) {
  return jwt.decode(token, { complete: true });
};

/**
 *
 * @param {string} token
 * @typedef {{valid: boolean, message: string}} Result
 * @returns {Result}
 */
exports.verify = function (token) {
  const decoded = jwt.decode(token, { complete: true });
  const alg = `${decoded.header.alg}`;

  var key;
  switch (alg) {
    case "RS256":
      key = Rsa.PUBLIC_KEY;
      break;
    case "HS256":
      if (decoded.payload.hasOwnProperty("salt")) {
        key = `${decoded.payload.salt}.${Secret.SHARED_SECRET}`;
      } else {
        key = Secret.SHARED_SECRET;
      }
      break;
    default:
      return {
        valid: false,
        message: `{ alg: ${alg} } not supported`,
      };
  }

  try {
    jwt.verify(token, key);
    return {
      valid: true,
      message: `{ alg: ${alg} } valid signature`,
    };
  } catch (err) {
    return {
      valid: false,
      message: `{ alg: ${alg} } ${err.message}`,
    };
  }
};
