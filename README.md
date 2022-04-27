<div align="center">
  <h1>
    HTTP Traffic Manager (Management)
  </h1>
  <p>
    Management for HTTP Traffic Manager
  </p>
  <p>
    <a href="https://github.com/aasaam/htm-management/actions/workflows/build.yml" target="_blank"><img src="https://github.com/aasaam/htm-management/actions/workflows/build.yml/badge.svg" alt="build" /></a>
    <a href="https://github.com/aasaam/htm-management/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/aasaam/htm-management"></a>
  </p>
</div>

## Run

```bash
export ASM_AUTH_HMAC_SECRET=`openssl rand -hex 32`
echo ASM_AUTH_HMAC_SECRET=$ASM_AUTH_HMAC_SECRET > .env
# add your infrastructer root ca into ./root.pem

docker-compose up -d
```

Run these script:

```bash
./app-cli.js super-admin
```

```bash
./app-cli.js generate-config
```

<div>
  <p align="center">
    <img alt="aasaam software development group" width="64" src="https://raw.githubusercontent.com/aasaam/information/master/logo/aasaam.svg">
    <br />
    aasaam software development group
  </p>
</div>
