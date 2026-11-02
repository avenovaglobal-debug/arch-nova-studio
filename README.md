# ArchNova Studio

A dark, CAD-inspired architectural design workspace for exploring 2D floor plans and 3D residential concepts.

## Stack
- Next.js App Router
- React
- TypeScript
- CSS and SVG for the initial interactive prototype

## Run locally
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Current prototype scope
- Reference-inspired graphite interface with forest-green accents
- 2D floor-plan workspace with SVG geometry
- Conceptual 3D house viewport
- Project, layer, floor, and properties panels
- Responsive layout for smaller screens

## Important limitations
This is an early visual prototype, not a production CAD/BIM system. The 3D viewport is illustrative rather than a true orbitable geometry engine. Cloud persistence, accounts, collaboration, professional DXF/BIM export, and production validation still need implementation.


## ArchNova Network (Web3 foundation)

The Web3 foundation is being developed alongside the Studio application. Phase 1 adds an ERC-721 project certificate registry, role-gated project registration and verification, content-hash version commitments, multi-chain testnet configuration, and contract tests.

See [docs/WEB3_ARCHITECTURE.md](docs/WEB3_ARCHITECTURE.md) for the architecture, security boundaries, supported test networks, and setup instructions.

**Status:** testnet foundation only. Contracts have not been deployed or audited. An ArchNova project certificate represents ownership of the digital token only; it does not by itself convey copyright, land title, or ownership of a physical building. No utility token is issued in this phase.
