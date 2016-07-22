const jwt = require('jsonwebtoken');

exports.decode = function (token) {
  return jwt.decode(token, {complete: true});
}
