# Black Duck Polaris MCP

MCP (Model Context Protocol) server for querying
[Black Duck Polaris](https://www.blackduck.com/polaris.html) security scan results. Enables AI
coding agents like Claude Code and GitHub Copilot to identify vulnerabilities, view scan results,
and get remediation guidance directly in your development workflow.

## Features

- Query security issues (SAST, SCA, DAST) across projects and branches
- Filter by severity, tool type, and delta (new vs existing issues)
- View code snippets for vulnerability occurrences
- Get AI-powered remediation guidance via Polaris Assist
- Browse portfolio hierarchy: applications, projects, branches
- Review scan history and test metrics

## Installation

### npm (for Claude Code, Copilot, etc.)

```bash
npx @mtgibbs/blackduck-polaris-mcp
```

### From source (Deno)

```bash
git clone https://github.com/mtgibbs/blackduck-polaris-mcp.git
cd blackduck-polaris-mcp
cp .env.example .env
# Edit .env with your Polaris URL and API token
deno task dev
```

## Configuration

| Variable            | Description                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `POLARIS_URL`       | Polaris instance URL (e.g., `https://polaris.blackduck.com`)                                 |
| `POLARIS_API_TOKEN` | API access token ([create one](https://polaris.blackduck.com) under Profile > Access Tokens) |

### Claude Code

Add to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "blackduck-polaris": {
      "command": "npx",
      "args": ["-y", "@mtgibbs/blackduck-polaris-mcp"],
      "env": {
        "POLARIS_URL": "https://polaris.blackduck.com",
        "POLARIS_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Available Tools

| Tool                     | Description                                                |
| ------------------------ | ---------------------------------------------------------- |
| `get_portfolios`         | Get the portfolio for your Polaris organization            |
| `get_applications`       | List applications in a portfolio                           |
| `get_projects`           | List projects (optionally filtered by application)         |
| `get_branches`           | List branches for a project                                |
| `get_issues`             | Get security issues with severity/tool/delta filters       |
| `get_occurrences`        | Get individual vulnerability instances with file/line info |
| `get_code_snippet`       | View source code around a vulnerability                    |
| `get_remediation_assist` | Get AI remediation guidance from Polaris Assist            |
| `get_tests`              | List security scan tests and their status                  |
| `get_test_metrics`       | Get issue count metrics for a scan                         |

## License

MIT
