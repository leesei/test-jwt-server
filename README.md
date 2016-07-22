# test-jwt-server

A JWT server for testing, DO NOT use in production.

This server accepts arbitrary payload from `GET`/`POST` and generate a signed JWT supporting 3 signature modes:
- `/jwt` signed with shared secret (HS256)  
  `GET /key.shared` to get the hard-coded shared secret.
- `/jwt.salted` signed with shared secret and salt (HS256)  
  A randomly generated `salt` field is put in each JWT payload.  
  The signature is key computed with `payload.salt + '.' + SHARED_SECRET`.
- `/jwt.rsa` signed with RSA private/public key pair (RS256)  
  `GET /key.public` to get the hard-coded public key.

## Installation

Environment: Node v6+

```sh
npm install -g test-jwt-server
```

## Usage

`/` endpoint will list all routes and descriptions.

The server will 
- parse the querystring in `GET` request or 
- parse body in `POST` request
as JWT payload (*claims* in JWT parlance).

Use `/payload` endpoint to test and build the payload before generating the JWT. See [`ljharb/qs`](https://github.com/ljharb/qs) to see how to build complex object with querystring.

With [HTTPie](https://github.com/jkbrzt/httpie), these yield the same result:
```sh
$ http --body GET 'http://localhost:8000/payload?items[]=1.1&items[]=2.2&items[]=3.3&foo.bar=42&user=me&iat=1000'

$ http --body POST http://localhost:8000/payload <<'EOF'
{
    "items": ["1.1","2.2","3.3"],
    "foo": {
        "bar": "42"
    },
    "user": "me",
    "iat": 1000
}
EOF
```

Due to limitation of querystring, custom fields will always be strings. Use `POST` to when you need numeric fields.

```sh
$ http --body POST http://localhost:8000/payload <<'EOF'
{
    "items": [1.1, 2.2, 3.3],
    "foo": {
      "bar": 42
    },
    "user": "me",
    "iat": 1000
}
EOF
```

## JWT Validators

Generated JWT can be validated with 3rd party validators.

[JSON Web Tokens - jwt.io](https://jwt.io/)  
[Online JWT generator and verifyer](http://kjur.github.io/jsjws/tool_jwt.html)  

## JWT RFCs

[RFC 7515 - JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515)  
[RFC 7516 - JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc75156)  
[RFC 7517 - JSON Web Key (JWK)](https://tools.ietf.org/html/rfc7517)  
[RFC 7518 - JSON Web Algorithms (JWA)](https://tools.ietf.org/html/rfc7518)  
[RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)  
