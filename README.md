# Semiconductor Job Map

A local-first worldwide semiconductor job finder. It keeps the useful A/B/C/D fit model, scores live roles against a user-supplied CV, organises established chip markets by country, and links directly to official company career portals. **Applications are manual: the app does not fill or submit employer forms.**

## What it does

- Covers major semiconductor manufacturing, equipment, materials, packaging, photonics, foundry and design hubs across Europe, North America, Asia, the Middle East and Oceania.
- Includes a curated directory of official career portals. Dynamic or bot-protected career sites can always be opened manually.
- Filters companies and scanned roles by country, region and Ata-specific tier. The scanner uses visible country controls when available, follows listing pagination, and validates the location on each job detail page.
- Scores physics, process, cleanroom, fabrication, photonics, characterisation, modelling, equipment and materials signals positively.
- Reduces fit scores for clearly senior, long-experience, required-PhD, RTL/ASIC-heavy or unrelated software roles.
- Strictly eliminates roles asking for more than one year of experience; 0–1 year, graduate and unspecified-experience roles remain in scope.
- Excludes United States locations from discovery and the portal directory. US-headquartered companies remain available in other target countries, but their global portals must provide positive location evidence before a role is assigned to a country.
- Does not penalise a role merely for being outside the UK. Visa, sponsorship and right-to-work questions are shown separately and never guessed.
- Lets Ata mark a discovered role as saved, applied, interview, rejected or offer after acting on the employer site.
- Pins the campaign order to United Kingdom, France, Taiwan, Netherlands and Singapore, with country-specific LinkedIn people searches for manual networking.
- Groups liked and tracked roles by country, ordered by fit score inside each country.

The country list is a practical map of established hiring markets, not a claim that every nation with a university lab or planned fab has active entry-level vacancies. Additions live in `lib/targets.ts`.

Targets represent hiring operations, not only corporate headquarters. A multinational therefore appears separately in each verified market—for example ASML, Applied Materials, Lam Research, KLA, ASM and Tokyo Electron under Taiwan as well as their home markets.

## Run locally

Requirements: Node.js 20+.

```bash
cd /path/to/ata-job-copilot
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Choose a country and tier. The official portal directory is available immediately. **Scan live jobs** uses country selectors where available, follows up to four listing pages per portal, validates each vacancy's real location and stores scored roles locally. Some Workday and JavaScript-heavy sites still do not expose job links to browser automation; use their **Open official careers portal** button in that case.

## Tier meaning

- **A:** Ata's strongest direct route — process, equipment, materials, fabrication, metrology and photonics.
- **B:** Strong semiconductor route, often broader or more competitive.
- **C:** Design-heavy employers; Ata should prioritise test, validation, applications, product or device roles rather than RTL-heavy roles.
- **D:** Adjacent suppliers and distributors; fallback pathways rather than the main target.

Tiers measure Ata's route into the industry, not company prestige.

## Safety and data

- Candidate facts come only from the current user's supplied CV and explicit statements. Never blend information from another person into the profile.
- Missing facts remain unknown. Eligibility, visa, nationality and sponsorship are never inferred.
- Local state is written atomically to `data/store.json`.
- Employer applications happen only in the original official portal, under Ata's control.
- The old ATS inspection routes remain in the code for compatibility with existing local records, but the interface no longer invokes automatic form preparation.

## Checks

```bash
npm test
npm run typecheck
npm run build
```
