#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  uptimeAgentTools,
  ListMonitorsArgs,
  GetMonitorArgs,
  CreateMonitorArgs,
  ListIncidentsArgs,
  GetIncidentArgs,
  ListIncidentsByMonitorArgs,
  CreateAnonymousTrackingArgs,
} from "./uptime/tools.js";
import { uptimeAgentClient } from "./uptime/client.js";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { platform } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isWindows = platform() === "win32";

// Helper function to properly convert file paths to URLs, especially for Windows
function createFileURL(filePath: string): URL {
  if (isWindows) {
    // Ensure path uses forward slashes for URL format
    const normalizedPath = filePath.replace(/\\/g, "/");
    // Ensure path has proper file:// prefix
    if (normalizedPath.startsWith("/")) {
      return new URL(`file://${normalizedPath}`);
    } else {
      return new URL(`file:///${normalizedPath}`);
    }
  } else {
    // For non-Windows, we can use the built-in function
    return pathToFileURL(filePath);
  }
}

async function runSetup() {
  try {
    // Fix for Windows ESM path issue
    const setupScriptPath = join(__dirname, "setup-claude-server.js");
    const setupScriptUrl = createFileURL(setupScriptPath);

    // Now import using the URL format
    const { default: setupModule } = await import(setupScriptUrl.href);
    if (typeof setupModule === "function") {
      await setupModule();
    }
  } catch (error) {
    console.error("Error running setup:", error);
    process.exit(1);
  }
}

const server = new Server(
  {
    name: "uptime-agent-model-context-protocol-server",
    version: "0.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: uptimeAgentTools,
  };
});

server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    try {
      if (!request.params.arguments) {
        throw new Error("Arguments are required");
      }

      switch (request.params.name) {
        case "listMonitors": {
          const response = await uptimeAgentClient.listMonitors();
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "getMonitor": {
          const args = request.params.arguments as unknown as GetMonitorArgs;
          if (!args.id) {
            throw new Error("Missing required argument: id");
          }
          const response = await uptimeAgentClient.getMonitor(args.id);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "createMonitor": {
          const args = request.params.arguments as unknown as CreateMonitorArgs;
          if (!args.name || !args.url) {
            throw new Error("Missing required arguments: name and url");
          }
          const response = await uptimeAgentClient.createMonitor(args);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "listIncidents": {
          const response = await uptimeAgentClient.listIncidents();
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "getIncident": {
          const args = request.params.arguments as unknown as GetIncidentArgs;
          if (!args.id) {
            throw new Error("Missing required argument: id");
          }
          const response = await uptimeAgentClient.getIncident(args.id);
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "listIncidentsByMonitor": {
          const args = request.params
            .arguments as unknown as ListIncidentsByMonitorArgs;
          if (!args.monitor_id) {
            throw new Error("Missing required argument: monitor_id");
          }
          const response = await uptimeAgentClient.listIncidentsByMonitor(
            args.monitor_id
          );
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        case "createAnonymousTracking": {
          const args = request.params
            .arguments as unknown as CreateAnonymousTrackingArgs;
          if (!args.url) {
            throw new Error("Missing required argument: url");
          }
          const response = await uptimeAgentClient.createAnonymousTracking(
            args
          );
          return {
            content: [{ type: "text", text: JSON.stringify(response) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  }
);

async function runServer() {
  try {
    // Check if first argument is "setup"
    if (process.argv[2] === "setup") {
      await runSetup();
      return;
    }

    // Show help text if requested
    if (
      process.argv[2] === "--help" ||
      process.argv[2] === "-h" ||
      process.argv[2] === "help"
    ) {
      console.log(`
=== uptime-agent-mcp CLI ===

Available commands:
  npx uptime-agent-mcp            Run the uptime agent MCP server
  npx uptime-agent-mcp setup      Configure Claude to use the uptime agent MCP server
  npx uptime-agent-mcp --help     Show this help message

For more information, visit: https://uptime-agent.io
      `);
      return;
    }

    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Uptime Agent MCP Server running on stdio");
  } catch (error) {
    console.error("Error in server:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error(
    `Unhandled rejection: ${
      reason instanceof Error ? reason.message : String(reason)
    }`
  );
  process.exit(1);
});

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
