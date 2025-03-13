# BETER WordPress plugin

This repository contains the code for Veter NRW WordPress plugin. The root directory contains the back-end code, `interface` has a React project with the front end.

## Available Scripts

In the project directory, you can run:

### `composer run build`

Runs the custom shell-script that build the React app, installs all dependencies and copresses everything into a .zip file.

### `composer run start`

Runs `docker compose up -d` and makes the site available on port `:8080`.

### `composer run stop`

Runs `docker compose down`.
