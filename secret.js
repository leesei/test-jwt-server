const jwt = require('jsonwebtoken');

exports.SHARED_SECRET = require('fs').readFileSync('./keys/shared.key', 'utf8').trim();
exports.jwt = function (payload) {
  return jwt.sign(payload, exports.SHARED_SECRET, { algorithm: 'HS256'});
}
exports.jwt_salted = function (payload) {
  // 12 characters random salt
  payload.salt = require('crypto').randomBytes(9).toString('base64');
  return jwt.sign(payload,
    payload.salt + '.' + exports.SHARED_SECRET,
    { algorithm: 'HS256'});
}
