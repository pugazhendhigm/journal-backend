import app from './app.js';
import dotenv from 'dotenv';
import { spawn } from 'node:child_process';
import { checkDatabaseConnection } from './database/db-check.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN;
let ngrokProcess;

async function configureNgrokAuthToken() {
  if (!NGROK_AUTHTOKEN) {
    return;
  }

  await new Promise((resolve, reject) => {
    const authProcess = spawn('ngrok', ['config', 'add-authtoken', NGROK_AUTHTOKEN], {
      stdio: 'ignore',
    });

    authProcess.on('error', reject);
    authProcess.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ngrok authtoken setup failed with exit code ${code}`));
    });
  });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchNgrokUrl() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4040/api/tunnels');
      const data = await response.json();
      const tunnel = data.tunnels?.find((item) => item.proto === 'https') || data.tunnels?.[0];
      if (tunnel?.public_url) {
        return tunnel.public_url;
      }
    } catch {
      // ngrok local api may not be ready yet
    }

    await wait(500);
  }

  throw new Error('ngrok tunnel URL was not available in time.');
}

async function startNgrok() {
  await configureNgrokAuthToken();

  ngrokProcess = spawn('ngrok', ['http', String(PORT), '--log=stdout'], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  ngrokProcess.stderr.on('data', (chunk) => {
    const message = chunk.toString().trim();
    if (message) {
      console.error(`ngrok error: ${message}`);
    }
  });

  ngrokProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`ngrok exited with code ${code}`);
    }
  });

  return fetchNgrokUrl();
}

function registerShutdown() {
  const shutdown = () => {
    if (ngrokProcess && !ngrokProcess.killed) {
      ngrokProcess.kill('SIGTERM');
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function startServer() {
  try {
    await checkDatabaseConnection();
    registerShutdown();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    if (NGROK_AUTHTOKEN) {
      try {
        const publicUrl = await startNgrok();
        console.log(`ngrok tunnel active at ${publicUrl}`);
      } catch (error) {
        console.error(`Unable to start ngrok: ${error.message}`);
      }
    } else {
      console.log('ngrok skipped: set NGROK_AUTHTOKEN to start a tunnel on server boot.');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
