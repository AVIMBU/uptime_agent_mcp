import { Tool } from "@modelcontextprotocol/sdk/types.js";

export interface ListMonitorsArgs {
  // No arguments needed
}

export interface GetMonitorArgs {
  id: string;
}

export interface CreateMonitorArgs {
  name: string;
  url: string;
  tracking_type?: string;
  http_method?: string;
  expected_status_code?: number;
  check_frequency?: number;
  timeout?: number;
  follow_redirects?: boolean;
  ssl_verification?: boolean;
}

export interface ListIncidentsArgs {
  // No arguments needed
}

export interface GetIncidentArgs {
  id: string;
}

export interface ListIncidentsByMonitorArgs {
  monitor_id: string;
}

export interface CreateAnonymousTrackingArgs {
  url: string;
  name?: string;
}

export const listMonitorsTool: Tool = {
  name: "listMonitors",
  description: "Get a list of all monitors for the authenticated team",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const getMonitorTool: Tool = {
  name: "getMonitor",
  description: "Get details for a specific monitor",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The ID of the monitor to retrieve",
      },
    },
    required: ["id"],
  },
};

export const createMonitorTool: Tool = {
  name: "createMonitor",
  description: "Create a new monitor",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the monitor",
      },
      url: {
        type: "string",
        description: "URL to monitor",
      },
      tracking_type: {
        type: "string",
        description: "Type of monitoring (http, ping, etc.)",
        enum: ["http", "ping", "port", "ssh", "dns"],
      },
      http_method: {
        type: "string",
        description: "HTTP method to use for HTTP monitors",
        enum: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
      },
      expected_status_code: {
        type: "integer",
        description: "Expected HTTP status code for HTTP monitors",
      },
      check_frequency: {
        type: "integer",
        description: "Frequency to check in seconds",
      },
      timeout: {
        type: "integer",
        description: "Timeout in seconds",
      },
      follow_redirects: {
        type: "boolean",
        description: "Whether to follow HTTP redirects",
      },
      ssl_verification: {
        type: "boolean",
        description: "Whether to verify SSL certificates",
      },
    },
    required: ["name", "url"],
  },
};

export const listIncidentsTool: Tool = {
  name: "listIncidents",
  description: "Get a list of all incidents for the authenticated team",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const getIncidentTool: Tool = {
  name: "getIncident",
  description: "Get details for a specific incident",
  inputSchema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "The ID of the incident to retrieve",
      },
    },
    required: ["id"],
  },
};

export const listIncidentsByMonitorTool: Tool = {
  name: "listIncidentsByMonitor",
  description: "Get incidents for a specific monitor",
  inputSchema: {
    type: "object",
    properties: {
      monitor_id: {
        type: "string",
        description: "The ID of the monitor to retrieve incidents for",
      },
    },
    required: ["monitor_id"],
  },
};

export const createAnonymousTrackingTool: Tool = {
  name: "createAnonymousTracking",
  description: "Create an anonymous tracking (doesn't require authentication)",
  inputSchema: {
    type: "object",
    properties: {
      url: {
        type: "string",
        description: "URL to monitor",
      },
      name: {
        type: "string",
        description: "Name of the monitor",
      },
    },
    required: ["url"],
  },
};

export const uptimeAgentTools = [
  listMonitorsTool,
  getMonitorTool,
  createMonitorTool,
  listIncidentsTool,
  getIncidentTool,
  listIncidentsByMonitorTool,
  createAnonymousTrackingTool,
];
