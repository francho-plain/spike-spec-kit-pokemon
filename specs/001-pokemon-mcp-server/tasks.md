# Tasks: Pokemon MCP Server

**Input**: Design documents from `/specs/001-pokemon-mcp-server/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as per constitution requirements for comprehensive testing.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Each user story must include tasks for testing standards, UX consistency, and performance requirements as per the constitution.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `MCP/src/`, `MCP/tests/` at repository root
- Paths shown below assume single project in MCP/ folder - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 Initialize TypeScript project with MCP SDK dependencies
- [X] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Setup Pokemon types/interfaces in MCP/src/types/pokemon.ts
- [X] T005 [P] Implement PokeAPI service in MCP/src/services/pokeApi.ts
- [X] T006 [P] Setup cache service in MCP/src/services/cache.ts
- [X] T007 Create validation utilities in MCP/src/utils/validation.ts
- [X] T008 Configure error handling infrastructure in MCP/src/utils/errors.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Retrieve Pokemon Information (Priority: P1) 🎯 MVP

**Goal**: Enable retrieval of complete Pokemon information by name from PokeAPI

**Independent Test**: Can be fully tested by calling the retrieve tool with a valid Pokemon name and verifying complete data return, or with invalid name and verifying error message.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T009 [P] [US1] Unit test for Pokemon retriever tool in MCP/tests/unit/tools/test-pokemonRetriever.spec.ts
- [X] T010 [P] [US1] Integration test for PokeAPI service in MCP/tests/integration/api/test-pokeApi.spec.ts

### Implementation for User Story 1

- [X] T011 [US1] Create pokemonRetriever tool in MCP/src/tools/pokemonRetriever.ts
- [X] T012 [US1] Integrate caching in retriever tool
- [X] T013 [US1] Add error handling for invalid Pokemon names

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Compare Two Pokemon (Priority: P2)

**Goal**: Enable comparison of two Pokemon showing stats differences, type matchups, and key attributes

**Independent Test**: Can be fully tested by calling the compare tool with two valid Pokemon names and verifying comparison output, or with invalid names and verifying error messages.

### Tests for User Story 2 ⚠️

- [X] T014 [P] [US2] Unit test for Pokemon comparer tool in MCP/tests/unit/tools/test-pokemonComparer.spec.ts
- [X] T015 [P] [US2] Integration test for comparison logic in MCP/tests/integration/test-comparison.spec.ts

### Implementation for User Story 2

- [X] T016 [US2] Create pokemonComparer tool in MCP/src/tools/pokemonComparer.ts
- [X] T017 [US2] Implement comparison logic (stats differences, type advantages)
- [X] T018 [US2] Add error handling for invalid Pokemon names

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T019 [P] Documentation updates in README.md
- [ ] T020 Code cleanup and refactoring
- [ ] T021 Performance optimization across all tools
- [ ] T022 [P] Additional unit tests in MCP/tests/unit/
- [ ] T023 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent of US1

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for Pokemon retriever tool in MCP/tests/unit/tools/test-pokemonRetriever.spec.ts"
Task: "Integration test for PokeAPI service in MCP/tests/integration/api/test-pokeApi.spec.ts"

# Launch implementation tasks sequentially:
Task: "Create pokemonRetriever tool in MCP/src/tools/pokemonRetriever.ts"
Task: "Integrate caching in retriever tool"
Task: "Add error handling for invalid Pokemon names"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence