# Design Document

## Overview

This design document outlines the approach for creating comprehensive technical documentation for the H.E.L.I.X. project. The documentation will be structured as a single, detailed markdown file that serves as a complete technical reference, replacing the existing basic project_structure.md file.

## Architecture

### Documentation Structure

The documentation will be organized into the following major sections:

1. **Project Overview** - High-level introduction and mission
2. **System Architecture** - Overall system design and component interactions
3. **Frontend Documentation** - React/TypeScript implementation details
4. **Backend Documentation** - FastAPI server and API endpoints
5. **Blockchain/ICP Integration** - Canister architecture and smart contracts
6. **AI/ML Fraud Detection** - Detection engines and algorithms
7. **Deployment Guide** - Production deployment procedures
8. **Development Guide** - Local setup and contribution workflow
9. **Security & Compliance** - Security measures and best practices
10. **API Reference** - Complete endpoint documentation
11. **Troubleshooting** - Common issues and solutions

### Documentation Format

- **Single Markdown File**: All documentation in `docs/project_structure.md`
- **Table of Contents**: Comprehensive TOC with anchor links for easy navigation
- **Code Examples**: Inline code snippets with syntax highlighting
- **Diagrams**: Mermaid diagrams for architecture and workflows
- **Cross-References**: Internal links between related sections
- **Version Information**: Technology versions and compatibility notes

## Components and Interfaces

### 1. Project Overview Section

**Purpose**: Provide context and mission statement

**Content**:
- Project name and tagline
- Mission statement (Jhalawar tragedy context)
- Key features and capabilities
- Technology stack summary
- Quick links to important resources

### 2. System Architecture Section

**Purpose**: Explain the overall system design

**Content**:
- High-level architecture diagram (Mermaid)
- Component interaction flows
- Data flow diagrams
- Technology stack details
- Network topology
- Integration points

**Diagrams**:
```mermaid
- Frontend ↔ Backend ↔ Blockchain architecture
- Authentication flow
- Fraud detection pipeline
- Hierarchical data flow
```

### 3. Frontend Documentation Section

**Purpose**: Document React/TypeScript implementation

**Content**:
- Directory structure with explanations
- Component architecture and patterns
- Authentication implementation (Internet Identity, Simple II, Demo mode)
- Role-based dashboard system (6 dashboards)
- State management (Context API, Zustand)
- Routing and navigation
- UI component library (Radix UI, Tailwind)
- Service layer architecture
- Type definitions and interfaces

**Subsections**:
- `/src` directory breakdown
- Component categories (Landing, Auth, Dashboard, Admin, Common, UI)
- Authentication services
- API integration services
- Hooks and utilities
- Styling and theming

### 4. Backend Documentation Section

**Purpose**: Document FastAPI server implementation

**Content**:
- Directory structure with explanations
- API architecture and design patterns
- Authentication and authorization (ICP Auth, RBAC)
- API endpoints by category
- Middleware implementation
- Database models and schemas
- Service layer architecture
- External integrations (ICP, fraud detection)
- Error handling and validation
- Logging and monitoring

**Subsections**:
- `/app` directory breakdown
- API routes (auth, government, deputy, vendor, citizen, fraud)
- Authentication system
- Configuration management
- Database layer
- Fraud detection integration
- ICP canister calls
- Middleware stack
- Utility functions

### 5. Blockchain/ICP Integration Section

**Purpose**: Document Internet Computer implementation

**Content**:
- Canister architecture overview
- Procurement canister details
- Smart contract implementations (Motoko)
- Internet Identity integration
- Principal-based authentication
- Role-based access control on-chain
- Data structures and types
- Deployment procedures (local and mainnet)
- Cycles management
- Canister upgrade procedures

**Subsections**:
- Procurement canister (`/canisters/procurement`)
- Fraud engine canister (`/canisters/fraud_engine`)
- Motoko source files
- Candid interface definitions
- Testing procedures
- Deployment scripts

### 6. AI/ML Fraud Detection Section

**Purpose**: Document fraud detection engines

**Content**:
- Fraud detection architecture overview
- Rules engine implementation (10 detection rules)
- ML detector with RAG pipeline
- Autonomous fraud engine
- Detection algorithms and scoring
- Feature extraction
- Model training and updates
- Integration with backend
- Performance metrics

**Subsections**:
- Basic fraud engine (`/AI/fraud_engine`)
- Autonomous fraud engine (`/AI/autonomous_fraud_engine`)
- Detection rules detailed explanation
- ML model architecture (Gemma 3, Ollama)
- RAG pipeline with FAISS
- Self-healing and learning components
- Investigation tools

### 7. Deployment Guide Section

**Purpose**: Provide deployment procedures

**Content**:
- Local development setup
- Docker deployment (docker-compose)
- ICP mainnet deployment
- Vercel frontend deployment
- Environment configuration
- Database setup
- Ollama and AI model setup
- Production considerations
- Monitoring and logging setup
- Backup and disaster recovery

**Subsections**:
- Prerequisites and requirements
- Local development environment
- Docker production deployment
- ICP canister deployment
- Frontend deployment (Vercel)
- Environment variables reference
- Health checks and monitoring

### 8. Development Guide Section

**Purpose**: Help contributors get started

**Content**:
- Development environment setup
- Code organization principles
- Coding standards and conventions
- Testing requirements (unit, integration, e2e)
- Git workflow and branching strategy
- Pull request process
- Code review guidelines
- Documentation standards
- Debugging tips

**Subsections**:
- Getting started for new developers
- Frontend development workflow
- Backend development workflow
- Blockchain development workflow
- Testing procedures
- Code quality tools (ESLint, Black, Prettier)
- Contribution guidelines

### 9. Security & Compliance Section

**Purpose**: Document security measures

**Content**:
- Authentication and authorization architecture
- Internet Identity security
- Principal-based access control
- Data encryption and protection
- API security measures
- Blockchain security features
- Audit trail implementation
- Compliance features (GDPR considerations)
- Security best practices
- Vulnerability reporting process

**Subsections**:
- Authentication security
- Authorization and RBAC
- Data protection measures
- Blockchain immutability
- Security testing
- Incident response

### 10. API Reference Section

**Purpose**: Complete API documentation

**Content**:
- Base URL and authentication
- Request/response formats
- Error handling
- Rate limiting
- Endpoint categories:
  - Authentication endpoints
  - Government endpoints
  - Deputy endpoints
  - Vendor endpoints
  - Citizen endpoints
  - Fraud detection endpoints
- Request/response examples
- Status codes and error messages

**Format**:
```
### POST /api/endpoint
Description: ...
Authentication: Required
Request Body: { ... }
Response: { ... }
Example: ...
```

### 11. Troubleshooting Section

**Purpose**: Help resolve common issues

**Content**:
- Common setup issues
- Frontend troubleshooting
- Backend troubleshooting
- Blockchain/ICP issues
- AI/ML model issues
- Deployment problems
- Performance issues
- FAQ

## Data Models

### Documentation Metadata

```typescript
interface DocumentationSection {
  title: string;
  level: number; // Heading level (1-6)
  anchor: string; // For TOC links
  content: string;
  subsections?: DocumentationSection[];
  codeExamples?: CodeExample[];
  diagrams?: Diagram[];
}

interface CodeExample {
  language: string;
  code: string;
  description?: string;
}

interface Diagram {
  type: 'mermaid' | 'ascii';
  content: string;
  caption?: string;
}
```

### File Structure Reference

```typescript
interface FileStructure {
  path: string;
  type: 'file' | 'directory';
  description: string;
  purpose?: string;
  keyFiles?: string[];
  children?: FileStructure[];
}
```

## Error Handling

### Documentation Quality Checks

- **Completeness**: All major components documented
- **Accuracy**: Information matches actual implementation
- **Clarity**: Clear explanations with examples
- **Navigation**: Working TOC and internal links
- **Code Examples**: Syntax-highlighted and tested
- **Diagrams**: Properly rendered Mermaid diagrams

### Validation Process

1. Review existing codebase for accuracy
2. Test all code examples
3. Verify all file paths and references
4. Check Mermaid diagram syntax
5. Validate internal links
6. Ensure consistent formatting

## Testing Strategy

### Documentation Testing

1. **Accuracy Testing**
   - Verify all file paths exist
   - Confirm technology versions
   - Validate code examples
   - Check API endpoint accuracy

2. **Usability Testing**
   - Test navigation flow
   - Verify TOC links work
   - Ensure examples are clear
   - Check diagram rendering

3. **Completeness Testing**
   - All components documented
   - All major features covered
   - All deployment scenarios included
   - All troubleshooting topics addressed

### Review Checklist

- [ ] All sections complete
- [ ] TOC generated and accurate
- [ ] Code examples tested
- [ ] Diagrams render correctly
- [ ] Internal links work
- [ ] File paths verified
- [ ] Technology versions current
- [ ] Formatting consistent
- [ ] Grammar and spelling checked
- [ ] Technical accuracy verified

## Implementation Approach

### Phase 1: Structure and Overview
1. Create comprehensive table of contents
2. Write project overview section
3. Document system architecture with diagrams
4. Establish documentation formatting standards

### Phase 2: Component Documentation
1. Document frontend architecture and components
2. Document backend API and services
3. Document blockchain/ICP integration
4. Document AI/ML fraud detection engines

### Phase 3: Operational Documentation
1. Write deployment guide
2. Create development guide
3. Document security and compliance
4. Create API reference

### Phase 4: Support Documentation
1. Write troubleshooting guide
2. Add FAQ section
3. Create quick start guides
4. Add examples and tutorials

### Phase 5: Review and Polish
1. Technical accuracy review
2. Completeness check
3. Formatting and consistency pass
4. Final proofreading

## Performance Considerations

### Documentation Size
- Target: Single comprehensive file (manageable size)
- Estimated: 2000-3000 lines
- Format: Markdown with Mermaid diagrams
- Loading: Fast rendering in GitHub and editors

### Maintainability
- Clear section organization
- Consistent formatting
- Easy to update
- Version-controlled with code

## Success Criteria

The documentation will be considered successful when:

1. **Completeness**: All major components and features documented
2. **Accuracy**: Information matches actual implementation
3. **Usability**: Developers can quickly find needed information
4. **Clarity**: Explanations are clear with helpful examples
5. **Navigation**: Easy to navigate with working TOC and links
6. **Maintainability**: Easy to update as project evolves
7. **Accessibility**: Readable by developers of all experience levels
8. **Comprehensiveness**: Covers development, deployment, and operations
