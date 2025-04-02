> This project is a customized solution based on the kubesphere/console project, providing a self-hosted cloud platform that helps users comprehensively understand and control the system's runtime status and resource usage through a visual Dashboard and feature-rich ControlHub.

## Install yarn

```bash
npm install -g yarn
```

## Install the dependencies

```bash
yarn install
```

## Configuring

- Create an .env file with the following

```bash
PROXY_DOMAIN= app-name.webos-acount.olares.cn
```

- Edit hosts configuration

```bash
# The browser opens this domain in place of localhost
127.0.0.1 test.webos-acount.olares.cn
```

- Create an local_config.yaml file with the following

```yaml
server:
  apiServer:
    url: https://app-name.webos-acount.olares.com
    wsUrl: https://app-name.webos-acount.olares.com
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

- ControlHub

```bash
yarn dev:system
```

- Studio

```bash
yarn dev:studio
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

- Control Hub

```bash
yarn build:system
```

- Studio

```bash
yarn build:studio
```

## CI

```

yarn vp
```
