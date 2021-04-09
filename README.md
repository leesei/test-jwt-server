# test-jwt-server

A JWT server for testing, DO NOT use in production.

This server accepts arbitrary payload from `GET`/`POST` and generate a signed JWT supporting 3 signature modes:

- `/jwt.secret` signed with shared secret (HS256)  
  `GET /key.secret` to get the shared secret.
- `/jwt.secret+salt` signed with shared secret and salt (HS256)  
  A randomly generated `salt` field is put in each JWT payload.  
  The signature is key computed with `${payload.salt}.${SHARED_SECRET}`.
- `/jwt.rsa` signed with RSA private/public key pair (RS256)  
  `GET /key.public` to get the public key.

## Installation

Environment: Node v15+

```sh
npm install -g test-jwt-server
test-jwt-server  # listen on port 8000 by default
# visit `http://localhost:8000/`

# change port to listen on
test-jwt-server -p 9000
test-jwt-server --port 9000
# visit `http://localhost:9000/`
```

## Keys

Default RSA 256 and shared secrets are put under `keys/`.

### Generating RSA 256 key pairs

```sh
ssh-keygen -t rsa -b 4096 -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
cat jwtRS256.key
cat jwtRS256.key.pub
```

### Generating shared secrets

> TODO

## With Docker

Environment: Docker 20.10+

Clone this repo.

```sh
export IMAGE=test-jwt-server
docker build -t $IMAGE .
docker run -p 8000:8000 -d $IMAGE
# visit `http://localhost:8000/`
```

`test-jwt-server` in the container will be listening on port `8000`, use Docker's `-p` option to map a different port on host to `8000`, e.g.:

```sh
docker run -p 9000:8000 -d $IMAGE
# visit `http://localhost:9000/`
```

This command line map the host's port `9000` to port `8000` of the container.

### Overriding keys

> RSA key pair must be overridden simultaneously.

You can use `-v` to override the bundled keys:

```sh
docker run -p 8000:8000 -d \
  -v $(pwd)/myRS256.key:/app/keys/jwtRS256.key \
  -v $(pwd)/myRS256.key.pub:/app/keys/jwtRS256.key.pub \
  -v $(pwd)/shared.secret:/app/keys/shared.secret \
  $IMAGE
```

## Usage

`/` endpoint will list all routes and descriptions.

The server will

- parse the querystring in `GET` request or
- parse body in `POST` request  
  as JWT payload (_claims_ in JWT parlance).

Use `/payload` endpoint to test and build the payload before generating the JWT.  
See [`ljharb/qs`](https://github.com/ljharb/qs) to see how to build complex object with querystring.

With [HTTPie](https://github.com/jkbrzt/httpie), these yield the same result:

```sh
$ http --body GET 'http://localhost:8000/payload?items[]=1.1&items[]=2.2&items[]=3.3&foo[bar]=42&user=me&iat=1000'

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

For more usage, see `examples/`.

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

## TODO

- Swagger  
  [Example YAML][] [Generated UI][]  
  [z0mt3c/hapi-swaggered: Yet another hapi plugin providing swagger compliant API specifications based on routes and joi schemas to be used with swagger-ui.](https://github.com/z0mt3c/hapi-swaggered)  
  [krakenjs/hapi-openapi: Build design-driven apis with OpenAPI (formerly swagger) 2.0 and hapi.](https://github.com/krakenjs/hapi-openapi)

[example yaml]: https://github.com/ansible-semaphore/semaphore/blob/master/api-docs.yml
[generated ui]: https://ansible-semaphore.github.io/semaphore/
