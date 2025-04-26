import { homedir, platform } from "os";
import { join } from "path";
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "node:child_process";
import { createInterface } from "readline";

// Fix for Windows ESM path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine OS and set appropriate config path
const os = platform();
const isWindows = os === "win32";
let claudeConfigPath;

switch (os) {
  case "win32":
    claudeConfigPath = join(
      process.env.APPDATA,
      "Claude",
      "claude_desktop_config.json"
    );
    break;
  case "darwin":
    claudeConfigPath = join(
      homedir(),
      "Library",
      "Application Support",
      "Claude",
      "claude_desktop_config.json"
    );
    break;
  case "linux":
    claudeConfigPath = join(
      homedir(),
      ".config",
      "Claude",
      "claude_desktop_config.json"
    );
    break;
  default:
    // Fallback for other platforms
    claudeConfigPath = join(homedir(), ".claude_desktop_config.json");
}

// Setup logging
const LOG_FILE = join(__dirname, "setup.log");

function logToFile(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${isError ? "ERROR: " : ""}${message}\n`;
  try {
    appendFileSync(LOG_FILE, logMessage);
    // For setup script, output to console in JSON format
    const jsonOutput = {
      type: isError ? "error" : "info",
      timestamp,
      message,
    };
    process.stdout.write(JSON.stringify(jsonOutput) + "\n");
  } catch (err) {
    // Last resort error handling
    process.stderr.write(
      JSON.stringify({
        type: "error",
        timestamp: new Date().toISOString(),
        message: `Failed to write to log file: ${err.message}`,
      }) + "\n"
    );
  }
}

// Function to get API key from user
function promptForApiKey() {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n=== uptime-agent.io Setup ===");
    console.log("This tool will configure Claude to work with uptime-agent.io");
    console.log("You'll need your uptime-agent.io API key to continue.");
    console.log(
      "You can find your API key in your account dashboard at https://uptime-agent.io"
    );

    rl.question("\nPlease enter your uptime-agent.io API Key: ", (apiKey) => {
      rl.close();
      if (!apiKey || apiKey.trim() === "") {
        console.log(
          "\nNo API Key provided. Using default configuration without API key."
        );
        console.log(
          "You'll need to add your API key manually later in Claude's settings."
        );
        resolve(null);
      } else {
        console.log("\nThank you! Setting up with the provided API key.");
        resolve(apiKey.trim());
      }
    });
  });
}

async function execAsync(command) {
  return new Promise((resolve, reject) => {
    // Use PowerShell on Windows for better Unicode support and consistency
    const actualCommand = isWindows ? `cmd.exe /c ${command}` : command;

    exec(actualCommand, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

async function restartClaude() {
  try {
    const platform = process.platform;
    // ignore errors when claude is not running
    try {
      switch (platform) {
        case "win32":
          await execAsync(`taskkill /F /IM "Claude.exe"`);
          break;
        case "darwin":
          await execAsync(`killall "Claude"`);
          break;
        case "linux":
          await execAsync(`pkill -f "claude"`);
          break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      if (platform === "win32") {
        // Windows auto-start not implemented
      } else if (platform === "darwin") {
        await execAsync(`open -a "Claude"`);
      } else if (platform === "linux") {
        await execAsync(`claude`);
      }
      logToFile(`Claude has been restarted.`);
    } catch {}
  } catch (error) {
    logToFile(
      `Failed to restart Claude: ${error}. Please restart it manually.`,
      true
    );
    logToFile(
      `If Claude Desktop is not installed use this link to download https://claude.ai/download`,
      true
    );
  }
}

// Function to detect if running via npx
function isRunningViaNpx() {
  // Multiple checks to determine if running via npx
  const importUrlCheck = import.meta.url.includes("node_modules");
  const npmExecPathCheck = process.env.npm_execpath?.includes("npx");
  const npxCacheCheck = __dirname.includes(".npx-cache") || __dirname.includes("_npx");
  const npmConfigCheck = process.env.npm_config_argv?.includes("npx");
  const nodePathCheck = process.env.NODE_PATH?.includes("npx");
  const cmdPathCheck = process.env._?.includes("npx");
  
  // Additional check specifically for our setup - when run via "npx uptime-agent-mcp setup"
  const runningFromPublishedPackage = !__dirname.includes("AVIMBU/uptime_agent_mcp");
  
  // For debugging - log all detection points
  logToFile(`NPX detection - importUrlCheck: ${importUrlCheck}`);
  logToFile(`NPX detection - npmExecPathCheck: ${npmExecPathCheck}`);
  logToFile(`NPX detection - npxCacheCheck: ${npxCacheCheck}`);
  logToFile(`NPX detection - npmConfigCheck: ${npmConfigCheck}`);
  logToFile(`NPX detection - nodePathCheck: ${nodePathCheck}`);
  logToFile(`NPX detection - cmdPathCheck: ${cmdPathCheck}`);
  logToFile(`NPX detection - runningFromPublishedPackage: ${runningFromPublishedPackage}`);
  logToFile(`NPX detection - __dirname: ${__dirname}`);
  
  // Consider it running via npx if any of these checks pass
  const isNpx = importUrlCheck || npmExecPathCheck || npxCacheCheck || 
                npmConfigCheck || nodePathCheck || cmdPathCheck || runningFromPublishedPackage;
  
  logToFile(`Final NPX detection result: ${isNpx}`);
  return isNpx;
}

// Check if config file exists and create default if not
if (!existsSync(claudeConfigPath)) {
  logToFile(`Claude config file not found at: ${claudeConfigPath}`);
  logToFile("Creating default config file...");

  // Create the directory if it doesn't exist
  const configDir = dirname(claudeConfigPath);
  if (!existsSync(configDir)) {
    import("fs").then((fs) => fs.mkdirSync(configDir, { recursive: true }));
  }

  // Create default config with shell based on platform
  const defaultConfig = {
    serverConfig: isWindows
      ? {
          command: "cmd.exe",
          args: ["/c"],
        }
      : {
          command: "/bin/sh",
          args: ["-c"],
        },
  };

  writeFileSync(claudeConfigPath, JSON.stringify(defaultConfig, null, 2));
  logToFile(
    "Default config file created. Please update it with your Claude API credentials."
  );
}

// Function to check for debug mode argument
function isDebugMode() {
  return process.argv.includes("--debug");
}

// Main function to export for ESM compatibility
export default async function setup() {
  // Log execution context for debugging
  logToFile(`Running setup from directory: ${__dirname}`);
  logToFile(`Process arguments: ${process.argv.join(' ')}`);
  
  // Ask for API key
  const apiKey = await promptForApiKey();

  const debugMode = isDebugMode();
  if (debugMode) {
    logToFile(
      "Debug mode enabled. Will configure with Node.js inspector options."
    );
  }
  
  try {
    // Read existing config
    const configData = readFileSync(claudeConfigPath, "utf8");
    const config = JSON.parse(configData);

    // Determine if running through npx or locally
    const isNpx = isRunningViaNpx();
    logToFile(`Running via NPX: ${isNpx}`);

    // Prepare the new server config based on OS
    let serverConfig;

    // Base environment variables with API key if provided
    const envVars = apiKey ? { UPTIME_API_KEY: apiKey } : {};

    if (debugMode) {
      // Add debug environment variables
      const debugEnv = {
        ...envVars,
        NODE_OPTIONS: "--trace-warnings --trace-exit",
        DEBUG: "*",
      };

      // Use Node.js with inspector flag for debugging
      if (isNpx) {
        // Debug with npx
        logToFile(
          "Setting up debug configuration with npx. The process will pause on start until a debugger connects."
        );

        serverConfig = {
          command: isWindows ? "node.exe" : "node",
          args: [
            "--inspect-brk=9229",
            isWindows
              ? join(process.env.APPDATA || "", "npm", "npx.cmd").replace(
                  /\\/g,
                  "\\\\"
                )
              : "$(which npx)",
            "uptime-agent-mcp@latest",
          ],
          env: debugEnv,
        };
      } else {
        // Debug with local installation path
        const indexPath = join(__dirname, "dist", "index.js");
        logToFile(
          "Setting up debug configuration with local path. The process will pause on start until a debugger connects."
        );

        serverConfig = {
          command: isWindows ? "node.exe" : "node",
          args: [
            "--inspect-brk=9229",
            indexPath.replace(/\\/g, "\\\\"), // Double escape backslashes for JSON
          ],
          env: debugEnv,
        };
      }
    } else {
      // Standard configuration without debug
      if (isNpx) {
        logToFile("Configuring for NPX execution");
        serverConfig = {
          command: isWindows ? "npx.cmd" : "npx",
          args: ["uptime-agent-mcp@latest"],
          env: envVars,
        };
      } else {
        // For local installation, use absolute path to handle Windows properly
        const indexPath = join(__dirname, "dist", "index.js");
        logToFile(`Configuring for local execution from: ${indexPath}`);
        serverConfig = {
          command: "node",
          args: [
            indexPath.replace(/\\/g, "\\\\"), // Double escape backslashes for JSON
          ],
          env: envVars,
        };
      }
    }

    // Initialize mcpServers if it doesn't exist
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Add or update the uptime agent server config
    config.mcpServers["uptime-agent"] = serverConfig;

    // Write the updated config back
    writeFileSync(claudeConfigPath, JSON.stringify(config, null, 2), "utf8");
    logToFile("Successfully added MCP server to Claude configuration!");
    logToFile(`Configuration location: ${claudeConfigPath}`);

    if (apiKey) {
      logToFile("Your uptime-agent.io API key has been configured.");
    } else {
      logToFile("No API key provided. You'll need to add it manually later.");
    }

    if (debugMode) {
      logToFile(
        "\nTo use the debug server:\n1. Restart Claude if it's currently running\n2. The server will be available as \"uptime-agent\" in Claude's MCP server list\n3. Connect your debugger to port 9229"
      );
    } else {
      logToFile(
        "\nTo use the server:\n1. Restart Claude if it's currently running\n2. The server will be available as \"uptime-agent\" in Claude's MCP server list"
      );
    }

    await restartClaude();
  } catch (error) {
    logToFile(`Error updating Claude configuration: ${error}`, true);
    process.exit(1);
  }
}

// Allow direct execution
if (
  process.argv.length >= 2 &&
  process.argv[1] === fileURLToPath(import.meta.url)
) {
  setup().catch((error) => {
    logToFile(`Fatal error: ${error}`, true);
    process.exit(1);
  });
}
