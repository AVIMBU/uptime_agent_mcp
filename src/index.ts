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
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Uptime Agent MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
