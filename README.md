# Uptime Agent MCP Server

A Model Context Protocol (MCP) server for the Uptime Agent API, allowing LLM chatbots (like Claude) to interact with your uptime monitoring system.

## Overview

This MCP server implements the [Model Context Protocol](https://modelcontextprotocol.ai/) specification to provide LLM chatbots with controlled access to your Uptime Agent API. It allows chatbots to:

- List, view, and create monitors
- List and view incidents
- Create anonymous trackings

## Setup

### Prerequisites

- Node.js 18 or higher
- Access to an Uptime Agent instance
- API key from your Uptime Agent account

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/uptime-agent-mcp.git
   cd uptime-agent-mcp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project:
   ```
   npm run build
   ```

### Configuration

Set the following environment variables:

- `UPTIME_API_KEY`: Your Uptime Agent API key

For example:
```bash
export UPTIME_API_KEY="your-api-key"
```

## Usage

### Running the Server

To start the MCP server:

```bash
node dist/index.js
```

### Integration with Claude

1. Configure Claude to use this MCP server
2. Share your API key with Claude when prompted

Example prompts:

- "Show me all my uptime monitors."
- "Create a new uptime monitor for https://example.com."
- "What incidents have occurred in the last week?"

## Available Functions

The MCP server provides the following functions:

### Monitor Management

- `listMonitors`: Get a list of all monitors
- `getMonitor`: Get details for a specific monitor
- `createMonitor`: Create a new monitor

### Incident Management

- `listIncidents`: Get a list of all incidents
- `getIncident`: Get details for a specific incident
- `listIncidentsByMonitor`: Get incidents for a specific monitor

### Anonymous Tracking

- `createAnonymousTracking`: Create an anonymous tracking (doesn't require authentication)

## Docker Support

A Dockerfile is provided for containerized deployment.

```bash
# Build the Docker image
docker build -t uptime-agent-mcp .

# Run the container
docker run -e UPTIME_API_KEY=your-api-key uptime-agent-mcp
```

## License

MIT
