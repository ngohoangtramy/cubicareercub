# Cubi interface update

This project now includes:

- A three-step onboarding flow: Education, Career, Review.
- Searchable university, programme and career selectors.
- 125 European universities across 28 countries.
- 875 demonstration programme records.
- 115 career positions across 8 categories.
- 300 unique demonstration skills.
- A light, higher-contrast visual system.
- Five primary navigation items: Home, My Skills, Career Path, Goals and Profile.
- A simplified dashboard with four summary cards.
- Shorter labels, descriptions and notices across the main user flow.

## Data note

The university names are broad European demo coverage. Programme associations and descriptions are demonstration records, not a verified catalogue of every programme offered by each institution. Replace this layer with a verified API or database before presenting programme availability as factual.

## Validation performed

- TypeScript syntax transpilation across all source files.
- Strict TypeScript checking for the three new mock-data modules.
- Runtime evaluation of the generated data modules to confirm record counts and unique skill IDs.

A full `npm run build` could not be executed in the editing sandbox because dependency installation was blocked by the available npm registry/network path.

## 2026-07-30 — Logo and Data Engineer route

- Replaced the browser favicon and primary Cubi brand mark with the supplied Cubi icon.
- Added PWA icon assets and a web manifest.
- Added the University of Amsterdam Bachelor's Business Analytics programme with its official programme link.
- Added a curated Data Engineer career profile with specific SQL, Python, modelling, pipeline, cloud and warehouse skills.
- Rebuilt the default demo around Business Analytics → Data Engineer.
- Added clickable course, practice and video resources to career-tree steps.
- Added a Business Analyst → Analytics Engineer alternative route into Data Engineering.
- Bumped local demo storage to v3 so the updated default route appears instead of stale browser data.

## Trilingual interface

Added a persistent EN / VI / NL language switch covering onboarding, analysis and all main Cubi pages. Vietnamese and Dutch translations are stored separately from canonical career data.

## 2026-08-02 — Guided Goals merged with learning evidence

- Added the complete guided Goals workspace to the final learning-evidence version.
- Clicking **Start action** opens ordered steps, checklists, deliverables, evidence prompts, credible courses, YouTube learning, projects, communities, events, competitions and application tasks.
- Added persistent step-level progress, goal completion, saved evidence and a prioritised next-three-steps queue.
- Included fully populated Data Engineer and Tissue Engineer demo pathways, plus a functional fallback plan for every other career.
- Preserved the project scanner, self-study forms, evidence scoring, skill updates and Career Path evidence integration from the final learning update.
- Merged Vietnamese and Dutch translations for both the guided Goals flow and the additional-evidence flow.
- Bumped local storage to `cubi-career-platform-v5` because the combined recommendation and evidence schema is incompatible with either earlier v4 build.

