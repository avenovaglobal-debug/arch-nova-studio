# ArchNova Network — Web3 architecture (Phase 1)

## Product objective

Extend ArchNova Studio with verifiable project registration and digital certificate ownership. The first on-chain deliverable is `ProjectOwnership`, an ERC-721 certificate with a stable project identifier, a content hash, a metadata pointer, role-gated registration, and authorized verification.

**Legal boundary:** ownership of an ArchNova ERC-721 certificate is ownership of that blockchain token only. It does not itself transfer architectural copyright, design licence, land title, building title, or other off-chain rights. Those rights require separate agreements and jurisdiction-specific review.

## Repository integration

This repository remains the application monorepo:

- `app/`: existing Next.js ArchNova Studio.
- `contracts/`: Solidity protocol contracts.
- `scripts/`: deployment and maintenance scripts.
- `test/`: smart contract tests.
- `docs/`: architecture and operational documentation.

## Initial contract

### ProjectOwnership

- ERC-721 token: one certificate per registered project.
- `projectId`: stable application-generated identifier; unique within each chain deployment.
- `contentHash`: commitment to a canonical project version. Hash private files locally; never upload private source files or personal data to public chain storage.
- `metadataURI`: metadata pointer. Use public metadata only, or a carefully designed access-controlled/encrypted metadata system.
- Roles: `DEFAULT_ADMIN_ROLE`, `PROJECT_CREATOR_ROLE`, `PROJECT_VERIFIER_ROLE`.
- Owner/approved operator/admin can update the current content commitment.
- Updating content invalidates the previous verification state.
- Verifiers can attest to the current on-chain version.

## Multi-chain model

Deploy the same audited contract version independently to supported EVM networks. Initial development targets:

| Network | Chain ID | Purpose |
| --- | ---: | --- |
| Ethereum Sepolia | 11155111 | Ethereum test environment |
| Base Sepolia | 84532 | L2 test environment |
| Polygon Amoy | 80002 | Polygon test environment |

The first release is **multi-deployment, not cross-chain bridging**. A project has a stable off-chain UUID/project ID and a chain-specific token ID. The backend stores the tuple `(chainId, contractAddress, tokenId)` and indexes events from every deployment. Do not claim that a token has moved across chains unless a separately reviewed bridge/lock-mint or canonical messaging protocol is implemented.

For cross-chain references, use an application-level project ID and verify the originating chain's contract address, chain ID, event, and transaction finality. Chain-specific registries remain authoritative for their own token state.

## Application integration (next increment)

1. Add wallet connection in the Studio UI with explicit chain/network display.
2. Add a server-side project registration API that authenticates the user, checks organization/project permissions, computes or validates a content hash, and prepares a transaction.
3. Keep signing in the user's wallet; never collect seed phrases or private keys.
4. Persist transaction lifecycle and chain references in PostgreSQL.
5. Index `ProjectRegistered`, `ProjectContentUpdated`, `ProjectVerificationChanged`, and ERC-721 transfer events.
6. Show registration and verification status in the project workspace.
7. Require explicit confirmation before any on-chain action; surface gas estimate, chain, contract address, and irreversible effects.

## Security and operations

- Use a hardware-backed or multisig admin for production; do not use a developer EOA as permanent admin.
- Grant creator and verifier roles to dedicated operational wallets with least privilege.
- Publish verified source code and deployment addresses for each chain.
- Run unit tests, static analysis, fuzzing/invariant tests, and an independent audit before mainnet.
- Keep secrets in deployment environment settings; never commit RPC credentials or private keys.
- Add emergency response and monitoring procedures before public launch.
- Testnet deployments only until legal, security, and operational reviews are complete.

## Future utility token

No token contract is included in Phase 1. Token design is a separate product, legal, and security decision. Before any issuance, define concrete utility, distribution, supply controls, governance, jurisdictional restrictions, disclosures, and whether the functionality can be delivered without a token. No sale, investment promise, yield, or price appreciation is implied.

## Local development

Install dependencies, then:

```bash
npm install
npm run chain:compile
npm run chain:test
```

To deploy to a configured testnet:

```bash
npm run chain:deploy -- --network baseSepolia
```

Configure the RPC URLs and deployer key using `.env.example`. Use test wallets and test funds only.
