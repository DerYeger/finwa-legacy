# FinWa-Backend

[![Backend CI](https://github.com/DerYeger/finwa/actions/workflows/backend_ci.yml/badge.svg?branch=develop&event=push)](https://github.com/DerYeger/finwa/actions/workflows/backend_ci.yml)

The backend of the FinWa application.

## Development

### Installation

Importing or reloading the Gradle project will also install all required dependencies.

### Development server

The Gradle `run` task will start the development server.
> Note: Default port is 8080.

### Linting & formatting

Run the Gradle `ktlintFormat` task to lint and format all source files. It will automatically run before compilation.

## Build

Run the Gradle `build` task to generate a `.jar` file. The build artifacts will be stored in the `build/libs/`
directory.

### Running tests

Run the Gradle `test` task to execute the unit tests.

## Deployment

### Documentation

Run the Gradle `dokkaHtml` task to generate the documentation. It will be stored in the `build/dokka/html/` directory.

### Docker

Run `docker-compose up -d --build` to build and start a container. Alternatively, build the image via the Dockerfile.
> Note: Default port is 8080.
