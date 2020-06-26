[![CLA assistant](https://cla-assistant.io/readme/badge/q-masters/vsqlik)](https://cla-assistant.io/q-masters/vsqlik)
![compile](https://github.com/q-masters/vsqlik/workflows/compile/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/q-masters/vsqlik/badge)](https://www.codefactor.io/repository/github/q-masters/vsqlik)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/installs-short/q-masters.vscode-qlik.svg)](https://marketplace.visualstudio.com/items?itemName=q-masters.vscode-qlik)

# Visual Studio Code - Qlik Extension

This extensions allows to use VSCode as an editor for Qlik Sense based systems.
It currently connects to Qlik Sense for Windows with Windows/NTLM authentification
and to Qlik Core / Docker without authentification.

## Install

Search for "vscode-qlik" in VSCode Extension Marketplace or go to
the Marketplace https://marketplace.visualstudio.com/items?itemName=q-masters.vscode-qlik and press Install.


## Usage

Watch the video .... TBD

### create new connection

- go to the window which was opened by vscode and press "CTRL + Shift + P" and search for "VSQlik: Show Connection Settings" and press enter.
- add new connection (remember 127.0.0.1:9076) which is what we run our docker container and map ports out
- disable secure (this docker container will not be)
- save and close

### open connection

- press again "CTRL + Shift + P" and search for "VSQlik: connect to server"
- select 127.0.0.1:9076
- create new folder (enter a name and press enter)

## Contribute / Debug

[Here](docs/contribute.md) you will find more howto compile the extension yourself.
