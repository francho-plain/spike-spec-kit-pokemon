<!--
Version change: 1.0.1 → 1.1.0
List of modified principles: Code Quality (added English language and minimal commenting requirements)
Added sections: None
Removed sections: None
Templates requiring updates: None
Follow-up TODOs: None
-->
# Spec Kit Constitution

## Core Principles

### I. Code Quality
All code must adhere to clean code principles: readable, maintainable, and well-structured. All code and documentation must be in English. Use the minimum comments possible, only when essential. Development follows baby steps: small, incremental changes. Commits must use conventional commit format with type(scope): description, and include in the body summaries of changes since the last commit and representative copilot prompts to ensure traceability and clarity.

### II. Testing Standards
Comprehensive testing is mandatory. Follow test-driven development (TDD) where feasible. Include unit tests for all functions, integration tests for components, and end-to-end tests for user flows. Tests must be automated and run in CI/CD pipelines.

### III. User Experience Consistency
All interfaces must be designed mobile-first, ensuring responsive design across devices. Accessibility AA compliance is mandatory, including keyboard navigation, screen reader support, and color contrast. Maintain consistent UX patterns and branding across all platforms and touchpoints.

### IV. Performance Requirements
Code must meet defined performance benchmarks for speed, memory usage, and scalability. Optimize for efficient resource utilization. Performance tests must be included in the test suite, and regressions must be addressed immediately.

## Technical Standards

These principles guide all technical decisions: Code quality ensures maintainability; testing ensures reliability; UX consistency ensures usability; performance ensures efficiency. All technical choices must align with these principles, with justifications required for any deviations.

## Development Workflow

Code reviews must verify compliance with principles. CI/CD must include automated tests, accessibility checks, and performance benchmarks. Conventional commits enforce discipline in change tracking.

## Governance

Constitution supersedes all other practices. Amendments require consensus from stakeholders, documentation, and migration plans. All decisions must reference relevant principles. Versioning follows semantic versioning.

**Version**: 1.1.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
