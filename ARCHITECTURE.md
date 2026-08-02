# Cubi production architecture outline

## Frontend

The frontend handles onboarding, review/correction, dashboard rendering, career-tree interaction, progress controls and transparent explanations. It must never scrape external sites directly.

## Backend/API

Recommended endpoints:

- `POST /api/analysis` — creates a background analysis job
- `GET /api/analysis/:id` — returns progress stages, errors and completed results
- `POST /api/catalogues/resolve` — resolves a public programme source
- `POST /api/evidence` — stores user-provided evidence
- `POST /api/reanalyse` — starts a source-aware refresh
- `GET /api/export` — exports the user profile and roadmap
- `DELETE /api/account` — removes account data and uploaded evidence

External connectors must use compliant public vacancy APIs, licensed datasets or company career pages. Do not bypass authentication, robots.txt, rate limits or platform terms. Do not use unauthorised LinkedIn scraping.

## Background workflow

1. Validate user consent and profile.
2. Resolve institution and programme.
3. Retrieve and cache catalogue pages or documents.
4. Extract courses with source URL and retrieval date.
5. Extract skills with evidence snippets and confidence.
6. Retrieve a diverse, dated vacancy sample from approved sources.
7. Aggregate required/preferred skills and source quality.
8. Compute explainable gaps and recommendations.
9. Generate alternative career paths.
10. Persist results and notify the frontend.

A failed source step should pause and request a catalogue URL, file upload, manual course entry or explicit use of a demonstration profile. The workflow must not invent successful retrieval.

## Suggested entities

- `users`
- `education_profiles`
- `institutions`
- `programmes`
- `courses`
- `course_skills`
- `occupations`
- `job_vacancies`
- `vacancy_skills`
- `user_skills`
- `skill_gaps`
- `recommendations`
- `career_paths`
- `milestones`
- `progress_records`
- `uploaded_evidence`

Every extracted record should retain source URL, retrieval timestamp, extractor version, confidence and user-correction state.

## Security and privacy

- Do not collect external university or employment-platform passwords.
- Encrypt sensitive data in transit and at rest.
- Scan uploads and restrict file types and size.
- Separate retrieved evidence from user corrections.
- Support deletion of uploaded evidence, generated results and the full account.
- Keep audit logs for consent, source retrieval and corrections.
