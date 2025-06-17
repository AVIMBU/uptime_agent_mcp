[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/avimbu-uptime-agent-mcp-badge.png)](https://mseep.ai/app/avimbu-uptime-agent-mcp)

# 🚀 Uptime Agent MCP Server

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Compliant-orange)](https://modelcontextprotocol.io/)
[![smithery badge](https://smithery.ai/badge/@AVIMBU/uptime_agent_mcp)](https://smithery.ai/server/@AVIMBU/uptime_agent_mcp)

Connect your [Uptime Agent](https://uptime-agent.io) monitoring system directly to AI assistants like Claude through the Model Context Protocol (MCP).

## ✨ Features

- **Real-time Monitoring Access**: Allow AI assistants to check your system's uptime status
- **Incident Management**: View and analyze downtime incidents through natural conversation
- **Monitor Creation**: Set up new monitoring endpoints with simple voice or text commands
- **Secure Integration**: Enterprise-grade security for your monitoring infrastructure

## 🔍 What is Uptime Agent?

[Uptime Agent](https://uptime-agent.io) is a powerful monitoring solution that tracks your websites and API endpoints, alerting you when they go down. This MCP server extends Uptime Agent's capabilities by letting you interact with your monitoring system through AI assistants.

## 🛠️ Installation

### Prerequisites

- Node.js 18 or higher
- An active Uptime Agent account
- Your Uptime Agent API key

To obtain your Uptime Agent API key:
1. Log in to your [Uptime Agent Dashboard](https://uptime-agent.io/dashboard)
2. Navigate to Account → API Keys
3. Create a new API key with appropriate permissions
4. Copy the generated key for use with the MCP server

### Option 1: Quick Install via NPM (Recommended)

The fastest way to get started is with our setup command:

```bash
npx uptime-agent-mcp setup
```

This command will:
- Install the MCP server
- Configure it for use with Claude Desktop
- Prompt you for your Uptime Agent API key
- Set up all necessary configurations automatically

### Option 2: Install via Smithery.ai

To install using Smithery.ai:

1. Create an account at [smithery.ai](https://smithery.ai)
2. Get your personal key from your Smithery account
3. Run the following command:

```bash
npx -y @smithery/cli@latest install @AVIMBU/uptime_agent_mcp --client claude --key <personal_key>
```

Replace `<personal_key>` with your actual Smithery personal key.

### Option 3: Manual Local Installation

For advanced users who want more control:

```bash
# Clone the repository
git clone https://github.com/AVIMBU/uptime_agent_mcp.git
cd uptime_agent_mcp

# Install dependencies
npm install

# Build the project
npm run build
```

Configure with your API key by creating a `.env` file:

```
UPTIME_API_KEY=your-api-key-here
PORT=3000  # Optional, defaults to 3000
```

Start the server:

```bash
npm start
# or directly with
node dist/index.js
```

## 🤖 AI Assistant Integration

### Setting Up with Claude Desktop

After installing using one of the methods above, your MCP server is automatically configured for Claude Desktop.

If you installed manually, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "uptime-agent": {
      "command": "npx",
      "args": [
        "-y",
        "uptime-agent-mcp"
      ],
      "env": {
        "UPTIME_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

Alternatively, you can use Docker:

```json
{
  "mcpServers": {
    "uptime-agent": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "UPTIME_API_KEY",
        "uptime-agent-mcp"
      ],
      "env": {
        "UPTIME_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

### Example Conversations

**Checking Monitors:**
> "Claude, show me all my active uptime monitors."

**Creating a New Monitor:**
> "Please create a new monitor for our API endpoint at https://api.mycompany.com/v2/health"

**Analyzing Incidents:**
> "What incidents happened on our production servers last week, and what was the average downtime?"

## 📊 Available Functions

### Monitor Operations

| Function | Description | Parameters |
|----------|-------------|------------|
| `listMonitors` | Get a complete list of all monitoring endpoints | None required |
| `getMonitor` | Retrieve detailed information about a specific monitor | `id`: Monitor identifier |
| `createMonitor` | Set up a new endpoint to monitor | `name`: Monitor name<br>`url`: URL to monitor<br>`tracking_type`: Type of monitoring (http, ping, etc.)<br>`check_frequency`: Check interval in seconds |

### Incident Management

| Function | Description | Parameters |
|----------|-------------|------------|
| `listIncidents` | View all detected downtime incidents | None required |
| `getIncident` | Get detailed information about a specific incident | `id`: Incident identifier |
| `listIncidentsByMonitor` | See all incidents for a particular endpoint | `monitor_id`: Monitor identifier |

### Public Tracking

| Function | Description | Parameters |
|----------|-------------|------------|
| `createAnonymousTracking` | Create public tracking without authentication | `url`: URL to monitor<br>`name`: (Optional) Name for the tracking |

### Integration with Slack (Coming Soon)

| Function | Description | Parameters |
|----------|-------------|------------|
| `slack_get_users` | List all users in connected Slack workspace | `limit`: Max number of users<br>`cursor`: Pagination cursor |
| `slack_post_message` | Post notifications to Slack | `channel_id`: Channel to post to<br>`text`: Message content |

## 🐳 Docker Deployment

We provide Docker support for easy deployment:

```bash
# Build the Docker image
docker build -t uptime-agent-mcp .

# Run the container
docker run -p 3000:3000 -e UPTIME_API_KEY=your-api-key uptime-agent-mcp
```

## 📬 Support

If you have questions or need assistance:

- [Open an issue](https://github.com/AVIMBU/uptime_agent_mcp/issues) on GitHub
- Contact us through our website: [AVIMBU](https://avimbu.com)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Developed with ❤️ by <a href="https://avimbu.com">AVIMBU</a></p>