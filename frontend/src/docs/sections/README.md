# Documentation Sections (`docs/sections/`)

## Overview

Individual documentation section components for the H.E.L.I.X. in-app documentation.

## Purpose

This directory contains modular documentation sections that are composed together in the main documentation component.

## Section Components

Each file represents a specific documentation topic:
- Getting Started guides
- Feature documentation
- API references
- Deployment instructions
- Troubleshooting guides

## Usage

Sections are imported and rendered by the main documentation component:

```tsx
import { GettingStartedSection } from './sections/GettingStarted';

<DocumentationSections>
  <GettingStartedSection />
</DocumentationSections>
```

## Related Documentation

- [Documentation Component](../README.md) - Main documentation component
- [Main README](../../../../README.md) - Project overview
