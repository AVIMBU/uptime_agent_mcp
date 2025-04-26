const UPTIME_API_URL = "https://app.uptime-agent.io/api/v1";
const UPTIME_API_KEY = process.env.UPTIME_API_KEY || "test";

if (!UPTIME_API_KEY) {
  throw new Error("UPTIME_API_KEY environment variable is required");
}

class UptimeAgentClient {
  async listMonitors() {
    return this.makeRequest("GET", "/monitors");
  }

  async getMonitor(id: string) {
    return this.makeRequest("GET", `/monitors/${id}`);
  }

  async createMonitor(params: any) {
    return this.makeRequest("POST", "/monitors", { monitor: params });
  }

  async listIncidents() {
    return this.makeRequest("GET", "/incidents");
  }

  async getIncident(id: string) {
    return this.makeRequest("GET", `/incidents/${id}`);
  }

  async listIncidentsByMonitor(monitorId: string) {
    return this.makeRequest("GET", `/incidents/by_monitor/${monitorId}`);
  }

  async createAnonymousTracking(params: any) {
    // This endpoint doesn't require authentication
    const response = await fetch(`${UPTIME_API_URL}/trackings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracking: params }),
    });

    if (!response.ok) {
      throw new Error(`Uptime Agent API error: ${response.statusText}`);
    }

    return response.json();
  }

  private async makeRequest(method: string, path: string, body?: any) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Only add API key if it exists
    if (UPTIME_API_KEY) {
      headers["X-Api-Key"] = UPTIME_API_KEY;
    }

    const response = await fetch(`${UPTIME_API_URL}${path}`, {
      method: method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Uptime Agent API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const uptimeAgentClient = new UptimeAgentClient();
