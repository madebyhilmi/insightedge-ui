import { AppWindow } from '../AppWindow';
import { kWindowNames } from '../config/overwolf-constants';
import fetch from 'cross-fetch';

class DesktopWindow extends AppWindow {
  private static _instance: DesktopWindow = undefined;
  private healthCheckInterval: number;
  private constructor() {
    super(kWindowNames.desktop);
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new DesktopWindow();
    }

    return this._instance;
  }

  /**
   * Periodically checks the health of the backend server and updates the connection status.
   * Initially checks every 5 seconds. If the backend server is healthy, checks every 60 seconds.
   */
  public async run() {
    let healthTimeout = 5 * 1000;
    this.healthCheckInterval = setInterval(async () => {
      const isHealthy = await this.checkHealth();
      if (isHealthy) {
        this.updateConnectionStatus('Connected');
        healthTimeout = 60 * 1000;
        // TODO: Implement logic that is dependent on backend being connected.
      } else {
        this.updateConnectionStatus('Disconnected');
      }
    }, healthTimeout); // Check health every 5 seconds or 60 seconds if connected.
  }

  /**
   * Checks the health of the backend server.
   * Sends a GET request to the /health endpoint and returns true if the server responds with a success status.
   * Logs an error and returns false if the request fails.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the server is healthy, and false otherwise.
   */
  private async checkHealth() {
    try {
      const response = await fetch('http://localhost:3000/health');
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Failed to connect to InsightEdge (Core):', error);
      return false;
    }
  }

  /**
   * Updates the connection status displayed on the page.
   * Changes the text content of the #connection-text element and the background color of the #connection-icon element.
   *
   * @param {string} status - The new connection status. Should be either 'Connected' or 'Disconnected'.
   *
   * @see {@link public/css/desktop.css} for related styles.
   */
  updateConnectionStatus(status: string) {
    const connectionText = document.getElementById('connection-text');
    const connectionIcon = document.getElementById('connection-icon');
    if (connectionText && connectionIcon) {
      connectionText.textContent = status;
      if (status === 'Connected') {
        connectionIcon.style.backgroundColor = 'green';
      } else {
        connectionIcon.style.backgroundColor = 'red';
      }
    }
  }
}

DesktopWindow.instance().run();
