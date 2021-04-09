const jwt = require("jsonwebtoken");
const Joi = require("joi");

const Secret = require("./secret");
const Rsa = require("./rsa");
const Decode = require("./decode");
const Payload = require("./payload");

const payload = Payload.parse(
  Joi.attempt(
    {
      user: "me",
      iat: 1000,
    },
    Payload.schema
  )
);
console.log(payload);

function secret() {
  const token = Secret.jwt(payload);
  console.log(token);

  console.log("====");
  const decoded = jwt.decode(token, { complete: true });
  console.log(decoded);

  console.log("====");
  console.log(Decode.verify(token));
}
secret();

function mismatch() {
  const token = jwt.sign(payload, "abcd", { algorithm: "HS256" });
  console.log(token);

  console.log("====");
  const decoded = jwt.decode(token, { complete: true });
  console.log(decoded);

  console.log("====");
  console.log(Decode.verify(token));

  const result = jwt.verify(token, "abcd");
  console.log(result);
}
mismatch();

function rsa() {
  const token = Rsa.jwt(payload);
  console.log(token);

  console.log("====");
  const decoded = jwt.decode(token, { complete: true });
  console.log(decoded);

  console.log("====");
  console.log(Decode.verify(token));

  const result = jwt.verify(token, Rsa.PUBLIC_KEY);
  console.log(result);
}
// rsa();
