# Changelog

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
