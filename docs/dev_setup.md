# Local setup

1. Install Node.js 22 or higher
2. From `services/backend`, install dependencies: `npm install`

# Running locally

Environment variables are defined in [`services/backend/src/utils/environment.js`](../services/backend/src/utils/environment.js). Defaults cover local development. For a real scan you need a GitHub token with the following permissions:
- `issues: write` for reading and writing issues
- `actions: write` if uploading and downloading artifacts

```bash
cd services/backend
npm run db:migrate
GITHUB_TOKEN=<token> GITHUB_REPOSITORY=<owner/repo> SCAN_DIR=<path-to-code> npm run scan
```

# Tests

```bash
cd services/backend
npm test
```

# GitHub Action

This repo is packaged as a composite action (`action.yml` at the repo root). Tag releases as `v1` / `v1.x.x` so consumers can use `DominicRoyStang/BlockedTODO@v1`.
