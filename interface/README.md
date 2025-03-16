# BETER interface

The interface for the plugin is a simple React application created with Vite.

## Directory Structure

- **src/**: Contains the source code for the React application.
  - **components/**: Contains reusable React components such as forms, previews, and settings.
  - **SettingsContext.tsx**: Provides context for managing application settings.
  - **service.ts**: Contains service functions for interacting with external APIs.
  - **i18n/**: Contains internationalization setup and translations.
  - **utils/**: Contains utility functions.
  - **main.tsx**: The entry point for the React application.
  - **theme.ts**: Defines the MUI theme for the application.
  - **types.d.ts**: Type declarations for external modules.
  - **vite-env.d.ts**: Type declarations for Vite.
- **public/**: Contains static assets and the HTML template.
- **dist/**: Contains the build output of the React application.
- **index.html**: The main HTML file for the application.
- **package.json**: Contains the project metadata and dependencies.
- **tsconfig.json**: TypeScript configuration file.
- **tsconfig.app.json**: TypeScript configuration for the application.
- **tsconfig.node.json**: TypeScript configuration for Node.js.
- **vite.config.ts**: Vite configuration file.
- **eslint.config.js**: ESLint configuration file.
- **.gitignore**: Specifies files and directories to be ignored by Git.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.

### `npm run build`

Builds the app for production.

### `npm run lint`

Lints the codebase using ESLint.

### `npm run preview`

Previews the production build.

## Dependencies

The project uses various dependencies including React, MUI, Vite, and others for building and styling the application.

## Development

To start development, run `npm install` to install all dependencies and then `npm run dev` to start the development server.

## Build

To build the project, run `npm run build`. The build artifacts will be stored in the `dist/` directory.