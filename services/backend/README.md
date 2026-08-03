# BlockedTODO Backend Service

Backend service to interact with the BlockedTODO database.

Exposes an HTTP server that receives GitHub webhook events and provides health check endpoints.

## Required environment variables

See the [environment.js](./src/utils/environment.js) file for a list of environment variables used by this service.

From there, you can see default values, formatting, and validation rules.
All environment variables used by the code should be added to the list in this file, and added to the config object exported by that file.

All of the required ones are automatically set when running with `docker compose`, but they do need to be set manually on production environments.

## Contributing

Here are some coding style quirks when working on the backend service.

- Always import models from the `src/db/index.js` file rather than via direct imports of the model files (except when working on a file in the same folder as the imported one)
- Always import utils from the `src/utils/index.js` file rather than the direct imports of the utils files (except when working on a file in the same folder as the imported one)
- Always use `config` (exported from `src/utils/index.js`) rather than `process.env` to read environment variables. More info under [Required Environment Variables](#required-environment-variables).
