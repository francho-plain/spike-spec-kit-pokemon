# Tasks: MyPokeDex

**Input**: Design documents from `/specs/001-mypokedex/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Comprehensive testing required per constitution - unit, integration, e2e included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Each user story must include tasks for testing standards, UX consistency, and performance requirements as per the constitution.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `src/` at repository root
- Components: `src/components/`
- Pages: `src/pages/`
- Services: `src/services/`
- Utils: `src/utils/`
- Tests: `tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan
- [X] T002 Initialize TypeScript React project with Vite
- [X] T003 Install and configure dependencies (React, Axios, React Query, TypeScript)
- [X] T004 [P] Setup testing frameworks (Jest, React Testing Library, Playwright)
- [X] T005 [P] Configure linting and formatting (ESLint, Prettier)
- [X] T006 [P] Setup accessibility tools (axe-core, React Aria)
- [X] T007 Configure build and development scripts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Implement TypeScript interfaces from data-model.md
- [X] T009 Create PokeAPI client service in src/services/pokeApi.ts
- [X] T010 [P] Create local storage service in src/services/localStorage.ts
- [X] T011 Setup React Query configuration for API caching
- [X] T012 Configure React Router for page navigation
- [X] T013 Create base App component with routing structure
- [X] T014 Setup global error boundary and loading states
- [X] T015 Configure CSS Modules for component styling

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Search and View Pokemon Details (Priority: P1) 🎯 MVP

**Goal**: Enable users to search for Pokemon by name with auto-complete and view complete details

**Independent Test**: Can be fully tested by searching for a Pokemon, verifying auto-complete, and confirming all details display correctly

### Tests for User Story 1

- [X] T016 [P] [US1] Contract test for Pokemon API endpoints in tests/contract/test-pokeapi.ts
- [X] T017 [P] [US1] Unit tests for data transformation utilities in tests/unit/utils/
- [X] T018 [US1] Integration test for search functionality in tests/integration/test-search.ts
- [X] T019 [US1] E2E test for search and view user flow in tests/e2e/specs/search-pokemon.spec.ts

### Implementation for User Story 1

- [X] T020 [P] [US1] Create PokemonCard component in src/components/PokemonCard.tsx
- [X] T021 [P] [US1] Create SearchBar component with auto-complete in src/components/SearchBar.tsx
- [X] T022 [US1] Create Home page with search and results in src/pages/Home.tsx
- [X] T023 [US1] Create PokemonDetail page in src/pages/PokemonDetail.tsx
- [X] T024 [US1] Implement routing between Home and PokemonDetail pages
- [X] T025 [US1] Add loading skeletons for API calls in components
- [X] T026 [US1] Implement error handling for failed API requests

**Checkpoint**: US1 complete - users can search and view Pokemon details

---

## Phase 4: User Story 2 - Mark Pokemon as Favorite (Priority: P2)

**Goal**: Allow users to mark Pokemon as favorites for easy access

**Independent Test**: Can be tested by marking/unmarking favorites and verifying persistence across sessions

### Tests for User Story 2

- [X] T027 [P] [US2] Unit tests for local storage service in tests/unit/services/
- [X] T028 [US2] Integration test for favorites functionality in tests/integration/test-favorites.ts
- [X] T029 [US2] E2E test for favorites user flow in tests/e2e/specs/favorites.spec.ts

### Implementation for User Story 2

- [X] T030 [P] [US2] Create FavoriteButton component in src/components/FavoriteButton.tsx
- [X] T031 [US2] Integrate FavoriteButton into PokemonDetail page
- [X] T032 [US2] Create Favorites page in src/pages/Favorites.tsx
- [X] T033 [US2] Add favorites route to router configuration
- [X] T034 [US2] Implement favorites persistence in local storage
- [X] T035 [US2] Add navigation to favorites from other pages

**Checkpoint**: US2 complete - users can mark and view favorites

---

## Phase 5: User Story 3 - Browse by Categories (Priority: P3)

**Goal**: Enable browsing Pokemon organized by type and generation

**Independent Test**: Can be tested by selecting categories and verifying filtered Pokemon lists

### Tests for User Story 3

- [ ] T036 [P] [US3] Contract test for category API endpoints in tests/contract/test-categories.ts
- [ ] T037 [US3] Integration test for category browsing in tests/integration/test-categories.ts
- [ ] T038 [US3] E2E test for category browsing user flow in tests/e2e/specs/categories.spec.ts

### Implementation for User Story 3

- [ ] T039 [P] [US3] Create CategoryBrowser component in src/components/CategoryBrowser.tsx
- [ ] T040 [US3] Integrate CategoryBrowser into Home page
- [ ] T041 [US3] Implement type-based filtering from PokeAPI
- [ ] T042 [US3] Implement generation-based filtering from PokeAPI
- [ ] T043 [US3] Add category navigation UI to Home page
- [ ] T044 [US3] Handle empty category results gracefully

**Checkpoint**: All user stories complete - full MyPokeDex functionality available

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Performance, accessibility, and quality improvements

- [ ] T045 [P] Implement performance monitoring in src/utils/performance.ts
- [ ] T046 [P] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] T047 [P] Optimize images and implement lazy loading
- [ ] T048 [P] Add error boundaries and user-friendly error messages
- [ ] T049 [P] Implement service worker for offline Pokemon data
- [ ] T050 [P] Add comprehensive unit tests for all components
- [ ] T051 [P] Polish mobile responsive design
- [ ] T052 [P] Add loading states and skeleton screens throughout app
- [ ] T053 [P] Implement proper error handling for all edge cases
- [X] T054 Run full test suite and fix any failures
- [ ] T055 Performance testing and optimization
- [ ] T056 Accessibility audit and AA compliance verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 can start immediately after foundational
  - US2 depends on US1 (needs detail view)
  - US3 can run in parallel with US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies - can start after foundational
- **US2 (P2)**: Depends on US1 completion (needs PokemonDetail page)
- **US3 (P3)**: No dependencies - can run parallel to US1/US2

### Within Each User Story

- Tests MUST be written first, ensure they FAIL before implementation
- Components before pages
- Services before components
- Core functionality before polish

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- US3 can run in parallel with US1/US2
- All tests for a user story marked [P] can run in parallel
- Different components within a story marked [P] can run in parallel
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for US1 together:
Task: "Contract test for Pokemon API endpoints in tests/contract/test-pokeapi.ts"
Task: "Unit tests for data transformation utilities in tests/unit/utils/"
Task: "Integration test for search functionality in tests/integration/test-search.ts"
Task: "E2E test for search and view user flow in tests/e2e/specs/search-pokemon.spec.ts"

# Launch all components for US1 together:
Task: "Create PokemonCard component in src/components/PokemonCard.tsx"
Task: "Create SearchBar component with auto-complete in src/components/SearchBar.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1
4. **STOP and VALIDATE**: Test US1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational
2. Add US1 → Test independently → Deploy/Demo (MVP!)
3. Add US2 → Test independently → Deploy/Demo
4. Add US3 → Test independently → Deploy/Demo
5. Add Polish → Final deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Developer A: US1 (search/view)
3. Developer B: US2 + US3 (favorites + categories)
4. Merge and test integration
5. Developer C: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Write tests FIRST, ensure they fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence