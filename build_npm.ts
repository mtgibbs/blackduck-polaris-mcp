import { build, emptyDir } from "@deno/dnt";

const denoJson = JSON.parse(Deno.readTextFileSync("./deno.json"));

await emptyDir("./npm");

await build({
  entryPoints: ["./agent.ts"],
  outDir: "./npm",
  importMap: "deno.json",
  shims: {
    deno: true,
  },
  scriptModule: false,
  package: {
    name: "@mtgibbs/blackduck-polaris-mcp",
    version: denoJson.version,
    description:
      "MCP server for querying Black Duck Polaris security vulnerabilities, issues, and scan results",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/mtgibbs/blackduck-polaris-mcp.git",
    },
    bugs: {
      url: "https://github.com/mtgibbs/blackduck-polaris-mcp/issues",
    },
    bin: {
      "blackduck-polaris-mcp": "esm/cli.js",
    },
    engines: {
      node: ">=18.0.0",
    },
    keywords: [
      "mcp",
      "model-context-protocol",
      "blackduck",
      "polaris",
      "security",
      "vulnerabilities",
      "sast",
      "sca",
      "dast",
    ],
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");

    // Create CLI wrapper that loads dotenv before the agent
    const cliContent = `#!/usr/bin/env node
import "dotenv/config";
import "./agent.js";
`;
    Deno.writeTextFileSync("npm/esm/cli.js", cliContent);

    // Patch out @std/dotenv import from config since we use dotenv/config in CLI wrapper
    const configPath = "npm/esm/src/utils/config.js";
    let configContent = Deno.readTextFileSync(configPath);
    configContent = configContent.replace(/import.*@std\/dotenv.*\n?/g, "");
    Deno.writeTextFileSync(configPath, configContent);

    // Add dotenv as a dependency
    const pkgPath = "npm/package.json";
    const pkg = JSON.parse(Deno.readTextFileSync(pkgPath));
    pkg.dependencies = pkg.dependencies ?? {};
    pkg.dependencies["dotenv"] = "^16.4.5";
    Deno.writeTextFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  },
});
