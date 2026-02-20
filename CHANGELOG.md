# Changelog

## [1.0.0](https://github.com/mtgibbs/blackduck-polaris-mcp/compare/blackduck-polaris-mcp-v0.1.3...blackduck-polaris-mcp-v1.0.0) (2026-02-20)


### Features

* Bug Tracking Integration API - config CRUD, project mappings, issue management ([2d66d80](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/2d66d80c9fba6e17033d399d3a663540b8a53863))
* Complete Portfolio API implementation (35 endpoints) ([bc69633](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/bc69633a80d34bbea949831fca3b1f4fe9bca710))
* PRD-T2 - Implement create test and update test endpoints ([efa7ba2](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/efa7ba2def1a4786f01d788b68f3f620c0049639))
* PRD-T3 - Implement comments, artifacts, and profiles endpoints ([f9c69fd](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/f9c69fd58e75646c0d3bcea5f989fd6f27814347))
* PRD-T4 - Implement subscription metrics and last-run endpoints ([d4f16f0](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/d4f16f0693fb1b5f22a337a940c0d3b7b7c86083))
* PRD-TL3 - Implement version mapping and version matrix endpoints ([f3ad781](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/f3ad78152a0a451cfdbbb04a8f26119dfa3df166))
* Repos Integration API - full SCM repository management ([4882a1f](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/4882a1fc64bba6c34cabb1a567135aeea0b5e8ce))
* Tests API - create, update, artifacts, comments, profiles, metrics ([5766c26](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/5766c260432d417447b9e164eb825699bfe4b3c2))
* Tools API - tool listing, versions, settings management ([9cd3e50](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/9cd3e503827d49d2858479bdb4ea713a6c7019da))


### Bug Fixes

* address PR review findings for Portfolio API ([820e8a3](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/820e8a3915cfae5a54b4b77cfada85c63305d570))
* clean up repos API tools and deduplicate shared plumbing ([68edeff](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/68edeffe062daec1da337e56cd664d5b1758751b))
* clean up tests API tools and remove artifact download stub ([e3e40f4](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/e3e40f42276c33098da3724d3aa1bc89d028ed25))
* clean up tools API layer and tool handlers ([20dc95f](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/20dc95f9b15f8bcd8ce2f18fc571a25c20b0c889))
* correct types and optional-param handling in bug tracking API ([3d1f06e](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/3d1f06eb34093a73339e228364dac02f57dd37d5))

## [0.1.3](https://github.com/mtgibbs/blackduck-polaris-mcp/compare/blackduck-polaris-mcp-v0.1.2...blackduck-polaris-mcp-v0.1.3) (2026-02-19)


### Features

* add bug tracking integration (Jira/Azure DevOps export) ([2d7763f](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/2d7763f54eb4afa7a62950e598470f45ffb37ba7))
* auto-resolve Organization-Id from portfolio API as fallback ([b858ca9](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/b858ca937fe8e0da36229240a771e8c816fe21d5))
* Complete Findings API implementation (35 endpoints) ([#5](https://github.com/mtgibbs/blackduck-polaris-mcp/issues/5)) ([fa3310d](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/fa3310d8a16e6640e41d7fc3c283096934dbd36a))


### Bug Fixes

* align API layer with portfolio and findings OpenAPI specs ([0a8cb81](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/0a8cb81359f8779e0a509c7d3b7f7337858970e5))
* align API layer with portfolio and findings OpenAPI specs ([6973b20](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/6973b2018523fba53bb6dd4ce0284e951f25399c))
* align bug tracking API with actual OpenAPI spec ([4fc6aad](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/4fc6aadff3f000e3a063518998897bc4b69a80e1))

## [0.1.2](https://github.com/mtgibbs/blackduck-polaris-mcp/compare/blackduck-polaris-mcp-v0.1.1...blackduck-polaris-mcp-v0.1.2) (2026-02-18)


### Bug Fixes

* remove leading ./ from bin path to avoid npm publish warning ([0639cfa](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/0639cfa69c3a6fb151d116801f5b707517056679))
* use npm trusted publishing (OIDC) instead of NPM_TOKEN ([182968e](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/182968e17cbd27853b12ed28960a99d6c6adfd48))

## [0.1.1](https://github.com/mtgibbs/blackduck-polaris-mcp/compare/blackduck-polaris-mcp-v0.1.0...blackduck-polaris-mcp-v0.1.1) (2026-02-18)


### Features

* initial MCP server for Black Duck Polaris API ([b5aff25](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/b5aff25f229278816d8529f51c0a297fc63546d8))


### Bug Fixes

* add actions:write permission for workflow dispatch in release-please ([4e63a85](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/4e63a85c731364e01c24c15e566bf43972fb4c9a))
* pass release-please PR output via env to avoid JSON parse error ([a6877ff](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/a6877ff328565ca4812ce0d0aa5b5aa916a361f9))
* resolve dnt npm build failures ([404b5aa](https://github.com/mtgibbs/blackduck-polaris-mcp/commit/404b5aaa10f8c0524fe990d380670f7aa613d512))
