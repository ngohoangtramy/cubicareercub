# Cubi trilingual interface

The website now supports three interface languages:

- English (`en`) — default
- Vietnamese (`vi`)
- Dutch (`nl`)

A segmented language switch is available during onboarding, during profile analysis, in the mobile header, and in the desktop sidebar. The selected language is stored in `localStorage` under `cubi-language` and is restored after page reload.

## Implementation

- `src/lib/i18n.tsx` — language state, persistence, translation engine, dynamic text handling and document language updates.
- `src/lib/translations.ts` — Vietnamese and Dutch dictionaries.
- `src/components/cubi/LanguageSwitcher.tsx` — EN / VI / NL switch.

Canonical data values remain in English so filters, saved profiles and career matching continue to work. Visible labels, descriptions, states, controls and mock-data explanations are translated at render time.
