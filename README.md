# Cubi — Your Career Cub

Cubi is an education-to-career planning prototype for students and early-career users. It maps course evidence to skills, compares those skills with a target occupation, explains skill gaps, recommends actions and renders alternative career routes.

## What is implemented

- Login and education-profile onboarding
- Staged analysis screen with recovery options
- Demonstration course and skill extraction with sources and confidence
- Demonstration job-market analysis with compliant-data architecture notes
- Explainable readiness overview and skill-gap dashboard
- Interactive, zoomable career tree with alternative routes
- Skill review, correction and evidence controls
- Course review and correction controls
- Action-plan status tracking
- Progress timeline, milestones and local evidence selection
- Editable profile, export and local-data deletion
- Responsive sidebar/mobile navigation
- Cohesive SVG Cubi mascot used across the flow

## Important prototype limitation

All analysis results are clearly labelled demonstration data. No live university catalogue or vacancy retrieval is performed by the browser. `src/lib/data-access.ts` defines the boundary for a future backend implementation.

## Run locally on Windows

```powershell
npm.cmd install
npm.cmd run dev
```

Open the localhost URL shown in PowerShell. To stop the server, press `Ctrl + C`.

## Production architecture

Use a backend or serverless worker for catalogue retrieval and job-market connectors. Add background jobs, caching, rate limiting, source retention, logging, consent records and account-level deletion. See `ARCHITECTURE.md`.
