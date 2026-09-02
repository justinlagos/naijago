# Tests

```
npm install                # first run only
npm test                   # routes, flows, money, contrast and responsive assertions
npm run bundle             # rebuild ./naijago-prototype.html from source
npm run test:bundle        # smoke-test the single-file bundle over file://
```

`e2e.mjs` serves the folder on port 4173 and drives a real Chromium. It needs
`playwright` on the machine. It uses Playwright's managed Chromium by default;
set `PLAYWRIGHT_CHROMIUM_PATH` only when you deliberately use another binary.

The assertions worth keeping when you port this to your own stack are listed in
`../docs/IMPLEMENTATION.md` §9.
