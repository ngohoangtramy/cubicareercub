# Netlify deployment

This project is a Lovable TanStack Start application built with Nitro.

Netlify must use:

- Build command: `bun run build`
- Publish directory: `dist`
- Runtime preset: `netlify`

These settings are committed in `netlify.toml` and should override the old
`dist/client` project setting.

## Redeploy

1. Commit and push these files to the branch connected to Netlify.
2. In Netlify, open **Deploys**.
3. Select **Trigger deploy** → **Clear cache and deploy site**.

If Netlify still reports `dist/client`, open **Project configuration** →
**Build & deploy** → **Build settings** and remove the old publish-directory
override, or change it to `dist`.
