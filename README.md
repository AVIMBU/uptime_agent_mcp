# 🚀 Uptime Agent MCP Server

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Compliant-orange)](https://modelcontextprotocol.io/)
[![smithery badge](https://smithery.ai/badge/@AVIMBU/uptime_agent_mcp)](https://smithery.ai/server/@AVIMBU/uptime_agent_mcp)
[![Install with VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=uptime-agent&inputs=%5B%7B%22type%22%3A%22promptString%22%2C%22id%22%3A%22uptime_api_key%22%2C%22description%22%3A%22Uptime%20Agent%20API%20Key%22%2C%22password%22%3Atrue%7D%5D&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22uptime-agent-mcp%22%5D%2C%22env%22%3A%7B%22UPTIME_API_KEY%22%3A%22%24%7Binput%3Auptime_api_key%7D%22%7D%7D)

Connect your [Uptime Agent](https://uptime-agent.io) monitoring system directly to AI assistants like Claude through the Model Context Protocol (MCP).

## ✨ Features

- **Real-time Monitoring Access**: Allow AI assistants to check your system's uptime status
- **Incident Management**: View and analyze downtime incidents through natural conversation
- **Monitor Creation**: Set up new monitoring endpoints with simple voice or text commands
- **Secure Integration**: Enterprise-grade security for your monitoring infrastructure

## 🔍 What is Uptime Agent?

[Uptime Agent](https://uptime-agent.io) is a powerful monitoring solution that tracks your websites and API endpoints, alerting you when they go down. This MCP server extends Uptime Agent's capabilities by letting you interact with your monitoring system through AI assistants.

## 🛠️ Quick Start

### Prerequisites

- Node.js 18 or higher
- An active Uptime Agent account
- Your Uptime Agent API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/uptime-agent-mcp.git
cd uptime-agent-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### API Key Setup

To obtain your Uptime Agent API key:

1. Log in to your [Uptime Agent Dashboard](https://uptime-agent.io/dashboard)
2. Navigate to Account → API Keys
3. Create a new API key with appropriate permissions
4. Copy the generated key for use with the MCP server

### Configuration

Create a `.env` file in the root directory with your credentials:

```
UPTIME_API_KEY=your-api-key-here
PORT=3000  # Optional, defaults to 3000
```

Or set environment variables directly:

```bash
export UPTIME_API_KEY="your-api-key"
export PORT=3000  # Optional
```

### Start the Server

```bash
npm start
# or directly with
node dist/index.js
```

## 🤖 AI Assistant Integration

### Setting Up with Claude Desktop

To connect this MCP server to Claude Desktop:

1. Add the following to your `claude_desktop_config.json`:

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

### Setting Up with VS Code

For quick installation in VS Code:

1. Click the "Install with VS Code" badge at the top of this README
2. Enter your Uptime Agent API key when prompted
3. The MCP server will be configured automatically

For manual installation, add this to your VS Code User Settings (JSON):

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "uptime_api_key",
        "description": "Uptime Agent API Key",
        "password": true
      }
    ],
    "servers": {
      "uptime-agent": {
        "command": "npx",
        "args": [
          "-y",
          "uptime-agent-mcp"
        ],
        "env": {
          "UPTIME_API_KEY": "${input:uptime_api_key}"
        }
      }
    }
  }
}
```

Alternatively, you can create `.vscode/mcp.json` in your workspace with the same configuration (omit the outer `"mcp"` key).

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

### CI/CD Integration

For GitHub Actions integration:

```yaml
name: Deploy Uptime Agent MCP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: yourregistry/uptime-agent-mcp:latest
      - name: Deploy to server
        run: |
          # Add your deployment commands here
          echo "Deploying to production server"
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

For local development and testing:

```bash
# Install dev dependencies
npm install --include=dev

# Run tests
npm test

# Run in development mode with hot reloading
npm run dev
```

## 📬 Support

If you have questions or need assistance:

- [Open an issue](https://github.com/AVIMBU/uptime_agent_mcp/issues) on GitHub
- Contact us through our website: [AVIMBU](https://avimbu.com)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">Developed with ❤️ by <a href="https://avimbu.com">AVIMBU</a></p>