> This project is a customized solution based on the kubesphere/console project, providing a self-hosted cloud platform that helps users comprehensively understand and control the system's runtime status and resource usage through a visual Dashboard and feature-rich ControlHub.

## Install yarn

```
npm install -g yarn
```

## Install the dependencies

```bash
yarn install
```

## Configuring

Create an .env file with the following

```
AUTH_TOKEN=xxxx
ACCOUNT=webos-acount

```

Create an local_config.yaml file with the following

```
server:
  apiServer:
    url: https://dashboard.webos-acount.myterminus.com
    wsUrl: https://dashboard.webos-acount.myterminus.com

```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

- Server

```bash
yarn dev:server
```

- Dashboard

```bash
yarn dev:dashboard
```

- System

```bash
yarn dev:system
```

### Lint the files

```bash
yarn lint
```

### Format the files

```bash
yarn format
```

### Build the app for production

- Server

```bash
yarn build:server
```

- Dashboard

```bash
yarn build:dashboard
```

- System

```bash
yarn build:system
```

## CI

```

yarn vp
```
