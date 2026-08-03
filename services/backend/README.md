# BlockedTODO Backend

Core scan logic for the BlockedTODO GitHub Action.

It parses the checked-out codebase for issue references in comments, tracks them in a SQLite database, and creates notification issues when watched GitHub issues are closed.

## Required environment variables

See [environment.js](./src/utils/environment.js) for the full list, defaults, and validation.

In GitHub Actions, `GITHUB_TOKEN` and `GITHUB_REPOSITORY` are provided automatically. The composite action also sets `DATABASE_FILE` and `SCAN_DIR`.

## Contributing

- Always import models from `src/db/index.js` rather than via direct imports of the model files (except when working on a file in the same folder as the imported one)
- Always import utils from `src/utils/index.js` rather than the direct imports of the utils files (except when working on a file in the same folder as the imported one)
- Always use `config` (exported from `src/utils/index.js`) rather than `process.env` to read environment variables
