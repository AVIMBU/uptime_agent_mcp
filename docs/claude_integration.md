# Using Uptime Agent MCP with Claude

This guide explains how to use the Uptime Agent MCP server with Claude to interact with your uptime monitoring system through natural language.

## Prerequisites

- Claude Desktop or Claude API access
- Uptime Agent MCP server running
- Your Uptime Agent API key

## Available Functions

Claude can perform the following actions through the MCP server:

### Monitor Management

- List all your monitors
- View details of a specific monitor
- Create new monitors

### Incident Management

- List all incidents
- View details of a specific incident
- List incidents for a specific monitor

### Anonymous Tracking

- Create anonymous trackings (no authentication required)

## Example Interactions

Here are examples of how to interact with Claude to use Uptime Agent functionality.

### Viewing Monitors

```
You: Show me all my uptime monitors. My API key is XXX123456789.

Claude: I'll retrieve your monitors for you.

[Claude lists your monitors with their status, URL, and other details]
```

### Getting Monitor Details

```
You: Can you give me details about my monitor with ID 42? My API key is XXX123456789.

Claude: Let me retrieve that information for you.

[Claude displays detailed information about the specific monitor]
```

### Creating a New Monitor

```
You: I need to create a new monitor for https://example.com. The site should be checked every 5 minutes. My API key is XXX123456789.

Claude: I'll help you create that monitor. What would you like to name it?

You: Example Website

Claude: Creating a monitor for Example Website at https://example.com with a 5-minute check frequency...

[Claude creates the monitor and confirms the creation]
```

### Viewing Incidents

```
You: What incidents have occurred across all my monitors in the last week? My API key is XXX123456789.

Claude: Let me check for incidents.

[Claude lists incidents with their duration, status, and affected monitors]
```

### Viewing Incidents for a Specific Monitor

```
You: Show me incidents for my monitor with ID 42. My API key is XXX123456789.

Claude: Retrieving incidents for that specific monitor.

[Claude displays incidents for the specified monitor]
```

### Creating Anonymous Tracking

```
You: I'd like to set up an anonymous tracking for https://example.org without using my API key.

Claude: I'll create an anonymous tracking for that URL.

[Claude creates the tracking and returns the URL for checking its status]
```

## Best Practices

1. **API Key Security**: Only share your API key with Claude when needed and in private conversations.

2. **Be Specific**: When creating monitors or querying for specific information, provide as much detail as possible.

3. **Formatting Responses**: If Claude's response is too detailed or not formatted to your liking, ask it to summarize or present the information differently.

4. **Troubleshooting**: If Claude encounters an error, check that your API key is valid and that the MCP server is running properly.

## Technical Details

When you provide your API key to Claude, it uses this key to authenticate with the Uptime Agent API through the MCP server. The server handles the actual API calls and returns the results to Claude, which then presents them to you in a conversational format.

The communication follows the Model Context Protocol specification, ensuring secure and standardized interaction between Claude and your Uptime Agent instance.
