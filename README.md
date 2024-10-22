# Project GenAI Frontend

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Lint](#lint)
- [Preview](#preview)
- [Testing](#testing)
- [Storybook](#storybook)
- [Docker](#docker)
- [Troubleshooting](#troubleshooting)
- [Localization](#localization)

## Overview

The repository is a template for React applications in GenAI. It utilizes [Vite](https://vitejs.dev/) for development and [TypeScript](https://www.typescriptlang.org/) for static typing. The project includes linting with [ESLint](https://eslint.org/) and testing with [Vitest](https://github.com/vitejs/vitest). Additionally, [Storybook](https://storybook.js.org/) is used for UI component development and documentation.

## Installation

Before you start, ensure that you have [Node.js](https://nodejs.org/) installed on your machine.

```bash
npm install
```

## Development
```bash
npm run dev
```
This command starts the development server using Vite, enabling hot module replacement for a fast and enjoyable development experience.

## Build
```bash
npm run build
```
To build the project for production, this command runs TypeScript compilation (tsc) followed by Vite build. The compiled and optimized files are placed in the dist directory.

## Lint
```bash
npm run lint
```
Lint the TypeScript and TypeScript React files using ESLint. This command reports any linting errors and warnings.

## Preview
```bash
npm run preview
```
Start a Vite development server to preview the production build. This allows you to test the optimized build locally before deployment.

## Testing
### Run Tests
```bash
npm test
```
Run tests using Vitest, including coverage reports.

### Watch Tests
```bash
npm run test:watch
```
Run tests in watch mode using Vitest.

### Coverage
```bash
npm run coverage
```
Generate test coverage reports using Vitest.

## Prepare
```bash
npm run prepare
```
Install Husky Git hooks. This command is automatically triggered by npm during the installation of dependencies.

## Storybook
### Development Server
```bash
npm run storybook
```
Start the Storybook development server, allowing you to interactively develop and test your components.

### Build Storybook
```bash
npm run build-storybook
```
Build the static files for Storybook. The output is typically found in the storybook-static directory.

## Docker
```bash
docker-compose build ui-nginx
```
Build the Docker image for the UI: `ui-nginx`. This command is typically used by the CI/CD pipeline.
Probably, it will be replaced by a GitHub Action.

```bash
docker-compose up
```
Start the Docker container for the UI: `ui-dev-server`. The container runs the development server using Vite, enabling hot module replacement.

```bash
docker-compose up ui-nginx
```
Start the Docker container for the UI: `ui-nginx`. The container runs the production build of the UI using Nginx.

## Troubleshooting
### HMR Not Working in Docker on Windows
If you are using Docker on Windows, you may encounter an issue where hot module replacement (HMR) does not work. To resolve this issue, you must enable polling in Vite. To do so, add `.env.local` to the root of the project and add the following line:
```ts
HMR_POLLING=true
```

## Localization

Translation is done via react i18next library https://react.i18next.com.
###  To add new language:
1. Create a folder with a locale name in `public/locales` directory.
2. Add all files with translations into that folder (see 'en' folder for an example).
3. Add locale import to `src/dayjs-helper.ts` - `import 'dayjs/locale/*localeName*`;

### To add new namespace:
1. Add file with a namespace to all locales folder inside `public/locales`.
2. Import corresponding files from en locale into `src/@types/i18next.d.ts`.
3. Add imported namespace to `resources` array. 

### To access project from local
1. Sign up and login into Github.
2. Request devops team for complete access
3. Git clone project repo
4. Generate token from Github-> Developer settings-> Token classic
5. replace the token from npmrc
6. npm install
7. npm run dev