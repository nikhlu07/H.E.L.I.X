# Scripts (`scripts/`)

## Overview

Automation scripts for H.E.L.I.X. deployment, setup, and maintenance.

## Purpose

Scripts provide automation for:
- Deployment to various environments
- Initial setup and configuration
- Database migrations
- ICP canister deployment
- Development environment setup

## Common Scripts

### Deployment

```bash
# Deploy to production
./scripts/deploy/deploy-production.sh

# Deploy to staging
./scripts/deploy/deploy-staging.sh

# Deploy ICP canisters
./scripts/deploy/deploy-canisters.sh
```

### Setup

```bash
# Initial project setup
./scripts/setup/init-project.sh

# Setup development environment
./scripts/setup/setup-dev.sh

# Install dependencies
./scripts/setup/install-deps.sh
```

## Usage

Make scripts executable:
```bash
chmod +x scripts/**/*.sh
```

Run scripts from project root:
```bash
./scripts/deploy/deploy-production.sh
```

## Related Documentation

- [Main README](../README.md) - Deployment instructions
- [Backend](../backend/README.md) - Backend deployment
- [Frontend](../frontend/README.md) - Frontend deployment
