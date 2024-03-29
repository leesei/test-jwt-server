const Joi = require("joi");

const PayloadSchema = Joi.object()
  .keys({
    // registered JWT claims
    // put here to enforce type checks
    iss: Joi.string().label("Issuer"),
    sub: Joi.string().label("Subject"),
    aud: Joi.string().label("Audience"),
    iat: Joi.number()
      .label("Issued At")
      .integer()
      .positive()
      .unit("seconds")
      .default(Math.floor(Date.now() / 1000) - 5),
    nbf: Joi.number().label("Not Before").integer().positive().unit("seconds"),
    exp: Joi.number()
      .label("Expiration Time")
      .integer()
      .positive()
      .unit("seconds")
      .min(Joi.ref("iat")),
    jti: Joi.string().label("JWT ID"),
    // my parameters
    user: Joi.string().description("mapped to sub"),
    ttl: Joi.number()
      .integer()
      .unit("seconds")
      .min(0)
      .max(24 * 3600)
      .default(24 * 3600)
      .description("ttl in seconds, mapped to exp"),
  })
  .xor("sub", "user")
  .without("ttl", "exp")
  .with("exp", "iat")
  .unknown(true)
  .options({ stripUnknown: true, abortEarly: false });

exports.schema = PayloadSchema;

/**
 * parse query/payload body to payload (JWT claims)
 * @param {Object} options - the claims
 * @returns {Object} - JWT payload
 */
exports.parse = function (options) {
  const payload = Object.assign({}, options);

  // handles mapping and defaults
  if (payload.user) {
    payload.sub = payload.user;
  }
  delete payload.user;

  // only take ttl if exp is not specified
  if (!payload.exp) {
    payload.exp = payload.iat + payload.ttl;
  }
  delete payload.ttl;

  if (!payload.iss) {
    payload.iss = "test.jwt.server";
  }

  return payload;
};
