# Starting with Development

This guide is only for Linux (Mac should be similiar), windows i never try so cant say.

## Requirements

- NodeJs: [NodeJS](https://nodejs.org/en/) very much straigt forward, i use the lts version
- VSCode: [VisualStudio Code](https://code.visualstudio.com/)
- Access to Qlik Sense Enterprise for Windows or with Docker to Qlik Core

## Install

```bash
# ssh
git clone git@github.com:PLH-Coding/vsqlik.git
# or https
git clone https://github.com/PLH-Coding/vsqlik.git

# install dependencies
cd vsqlik/src && npm i
```

## VSIX

sometimes it is helpfull to share the extension from development state (next release), this could be done with running, and then share the vsix file which can imported into visual studio code.

```bash
cd vsqlik/src
npm ci # ensure we are up to date
npm run vsce:package
```

## Webview

Vscode Qlik uses angular 9 for the webview, to start extension for development you have to build this app one time.

```bash
npm run webview:build
```

If you want made changes on the webview itself run following command, this will run a local dev server on port 4200.

```bash
npm run webview:dev
```

## If you use Docker an Example to get it running

### Enable Qlik Core Engine on Docker

```bash
cd ~
mkdir qlik-docker

# everyone can read / write
sudo chmod 0777 -R qlik-docker
```

### Run Qlik Core

latest qlik engine version could be found here:

https://hub.docker.com/r/qlikcore/engine/tags

```bash
# start container (download if not allready exists) and map to: 127.0.0.1:9076
# if we create apps / or have apps we will find them in our directory ~/qlik-docker
docker run --volume ~/qlik-docker:/home/engine/Qlik/Sense -p 127.0.0.1:9076:9076 qlikcore/engine:[QLIK_ENGINE_DOCKER_VERSION] -S AcceptEULA=yes -S BuildAppCacheAtStartup=1 
```

## Run extension

This extension is in development mode, so the only way to test this currently is running this extension in debug mode directly in vscode. To do this you need open vscode directly in the vsqlik directory or open the directory in vscode and press the key "F5" to start debug mode. This should open a new window.

> Important ! Ensure you dont have multiple Directories open since this would create a multi root workspace
> This will currently only work if you have the root directory openend

```bash
cd ~/vsqlik
code .
```
