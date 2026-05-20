const presets = [
  {
    name: 'Auth · Sign Up',
    method: 'POST',
    endpoint: '/auth/signup',
    auth: false,
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'test@example.com', password: 'secret123' },
    pathVars: [],
  },
  {
    name: 'Auth · Verify Email',
    method: 'POST',
    endpoint: '/auth/verify-email',
    auth: false,
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'test@example.com', otp: '123456' },
    pathVars: [],
  },
  {
    name: 'Auth · Login',
    method: 'POST',
    endpoint: '/auth/login',
    auth: false,
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'test@example.com', password: 'secret123' },
    pathVars: [],
  },
  {
    name: 'Users · Get Me',
    method: 'GET',
    endpoint: '/users/me',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: {},
    pathVars: [],
  },
  {
    name: 'Users · Update Me',
    method: 'PATCH',
    endpoint: '/users/me',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: { full_name: 'Test User', avatar_url: 'https://placehold.co/120x120' },
    pathVars: [],
  },
  {
    name: 'Journals · Create',
    method: 'POST',
    endpoint: '/journals',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: {
      content: 'Today I tested the new API workspace.',
      mood: 'productive',
      tags: ['testing', 'workspace'],
    },
    pathVars: [],
  },
  {
    name: 'Journals · List',
    method: 'GET',
    endpoint: '/journals',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: {},
    pathVars: [],
  },
  {
    name: 'Journals · Update',
    method: 'PUT',
    endpoint: '/journals/:id',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: {
      content: 'Updated from API workspace.',
      mood: 'focused',
      tags: ['updated', 'journal'],
    },
    pathVars: [{ key: 'id', value: '' }],
  },
  {
    name: 'Journals · Delete',
    method: 'DELETE',
    endpoint: '/journals/:id',
    auth: true,
    headers: { 'Content-Type': 'application/json' },
    body: {},
    pathVars: [{ key: 'id', value: '' }],
  },
];

const baseUrlInput = document.getElementById('baseUrl');
const authTokenInput = document.getElementById('authToken');
const methodInput = document.getElementById('method');
const endpointInput = document.getElementById('endpoint');
const requiresAuthInput = document.getElementById('requiresAuth');
const headersJsonInput = document.getElementById('headersJson');
const bodyJsonInput = document.getElementById('bodyJson');
const collectionList = document.getElementById('collectionList');
const historyList = document.getElementById('historyList');
const pathVarsContainer = document.getElementById('pathVars');
const responseOutput = document.getElementById('responseOutput');
const responseStatus = document.getElementById('responseStatus');

baseUrlInput.value = localStorage.getItem('workspace_base_url') || 'http://localhost:5001/api/v1';
authTokenInput.value = localStorage.getItem('workspace_token') || '';

const existingDraft = localStorage.getItem('workspace_draft');
if (existingDraft) {
  try {
    hydrateRequest(JSON.parse(existingDraft));
  } catch {
    hydrateRequest(presets[0]);
  }
} else {
  hydrateRequest(presets[0]);
}

renderPresets();
renderHistory();

document.getElementById('saveEnv').addEventListener('click', () => {
  localStorage.setItem('workspace_base_url', baseUrlInput.value.trim());
  localStorage.setItem('workspace_token', authTokenInput.value.trim());
  setStatus('Environment saved');
});

document.getElementById('clearEnv').addEventListener('click', () => {
  authTokenInput.value = '';
  localStorage.removeItem('workspace_token');
  setStatus('Bearer token cleared');
});

document.getElementById('saveCurrent').addEventListener('click', () => {
  localStorage.setItem('workspace_draft', JSON.stringify(readRequestState()));
  setStatus('Draft saved');
});

document.getElementById('formatJson').addEventListener('click', () => {
  try {
    headersJsonInput.value = JSON.stringify(JSON.parse(headersJsonInput.value || '{}'), null, 2);
    bodyJsonInput.value = JSON.stringify(JSON.parse(bodyJsonInput.value || '{}'), null, 2);
    setStatus('JSON formatted');
  } catch (error) {
    setStatus(`Invalid JSON: ${error.message}`);
  }
});

document.getElementById('sendRequest').addEventListener('click', sendRequest);
document.getElementById('addPathVar').addEventListener('click', () => addPathVarRow('', ''));

function setStatus(text) {
  responseStatus.textContent = text;
}

function renderPresets() {
  collectionList.innerHTML = '';

  presets.forEach((preset) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'endpoint-item';
    item.innerHTML = `
      <div class="endpoint-top">
        <span class="method ${preset.method}">${preset.method}</span>
        <strong>${preset.name}</strong>
      </div>
      <div class="path">${preset.endpoint}</div>
    `;
    item.addEventListener('click', () => hydrateRequest(preset));
    collectionList.appendChild(item);
  });
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('workspace_history') || '[]');
  historyList.innerHTML = '';

  if (!history.length) {
    historyList.innerHTML = '<div class="small">No requests sent yet.</div>';
    return;
  }

  history.forEach((entry, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-top">
        <span class="method ${entry.method}">${entry.method}</span>
        <strong>${entry.status}</strong>
      </div>
      <div class="path">${entry.endpoint}</div>
    `;
    item.addEventListener('click', () => {
      responseOutput.textContent = JSON.stringify(entry.payload, null, 2);
      setStatus(`History ${index + 1}`);
    });
    historyList.appendChild(item);
  });
}

function hydrateRequest(config) {
  methodInput.value = config.method || 'GET';
  endpointInput.value = config.endpoint || '/';
  requiresAuthInput.value = String(Boolean(config.auth));
  headersJsonInput.value = JSON.stringify(config.headers || { 'Content-Type': 'application/json' }, null, 2);
  bodyJsonInput.value = JSON.stringify(config.body || {}, null, 2);
  renderPathVars(config.pathVars || []);
}

function readRequestState() {
  return {
    method: methodInput.value,
    endpoint: endpointInput.value,
    auth: requiresAuthInput.value === 'true',
    headers: JSON.parse(headersJsonInput.value || '{}'),
    body: JSON.parse(bodyJsonInput.value || '{}'),
    pathVars: readPathVars(),
  };
}

function renderPathVars(vars) {
  pathVarsContainer.innerHTML = '';
  if (!vars.length) {
    addPathVarRow('', '');
    return;
  }
  vars.forEach((item) => addPathVarRow(item.key, item.value));
}

function addPathVarRow(key, value) {
  const row = document.createElement('div');
  row.className = 'pair-row';
  row.innerHTML = `
    <input placeholder="key" value="${escapeHtml(key)}" />
    <input placeholder="value" value="${escapeHtml(value)}" />
    <button class="ghost" type="button">Remove</button>
  `;
  row.querySelector('button').addEventListener('click', () => row.remove());
  pathVarsContainer.appendChild(row);
}

function readPathVars() {
  return Array.from(pathVarsContainer.children)
    .map((row) => {
      const [keyInput, valueInput] = row.querySelectorAll('input');
      return { key: keyInput.value.trim(), value: valueInput.value.trim() };
    })
    .filter((item) => item.key);
}

function replacePathVars(endpoint, vars) {
  let output = endpoint;
  vars.forEach(({ key, value }) => {
    output = output.replace(`:${key}`, encodeURIComponent(value));
  });
  return output;
}

function saveHistory(entry) {
  const history = JSON.parse(localStorage.getItem('workspace_history') || '[]');
  history.unshift(entry);
  localStorage.setItem('workspace_history', JSON.stringify(history.slice(0, 10)));
  renderHistory();
}

async function sendRequest() {
  let requestState;

  try {
    requestState = readRequestState();
  } catch (error) {
    setStatus(`Invalid JSON: ${error.message}`);
    return;
  }

  const baseUrl = baseUrlInput.value.trim().replace(/\/$/, '');
  const endpoint = replacePathVars(requestState.endpoint, requestState.pathVars);
  const url = `${baseUrl}${endpoint}`;
  const headers = { ...requestState.headers };
  headers['x-api-playground'] = 'true';

  if (requestState.auth) {
    const token = authTokenInput.value.trim();
    if (!token) {
      setStatus('Bearer token required');
      return;
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const options = { method: requestState.method, headers };
  if (!['GET', 'DELETE'].includes(requestState.method)) {
    options.body = JSON.stringify(requestState.body);
  }

  responseOutput.textContent = 'Sending request...';
  setStatus(`${requestState.method} ${endpoint}`);

  try {
    const startedAt = performance.now();
    const response = await fetch(url, options);
    const elapsed = Math.round(performance.now() - startedAt);
    const raw = await response.text();
    let parsed;

    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = { raw };
    }

    const token = parsed?.data?.token || parsed?.data?.session?.access_token;
    if (token) {
      authTokenInput.value = token;
      localStorage.setItem('workspace_token', token);
    }

    const view = {
      request: {
        method: requestState.method,
        url,
        headers,
        body: ['GET', 'DELETE'].includes(requestState.method) ? null : requestState.body,
      },
      response: {
        status: response.status,
        statusText: response.statusText,
        timeMs: elapsed,
        body: parsed,
      },
    };

    responseOutput.textContent = JSON.stringify(view, null, 2);
    setStatus(`${response.status} ${response.statusText} · ${elapsed}ms`);
    localStorage.setItem('workspace_draft', JSON.stringify(requestState));
    saveHistory({
      method: requestState.method,
      endpoint,
      status: `${response.status} ${response.statusText}`,
      payload: view,
    });
  } catch (error) {
    const view = {
      request: {
        method: requestState.method,
        url,
        headers,
        body: ['GET', 'DELETE'].includes(requestState.method) ? null : requestState.body,
      },
      error: error.message,
    };

    responseOutput.textContent = JSON.stringify(view, null, 2);
    setStatus('Request failed');
    saveHistory({
      method: requestState.method,
      endpoint,
      status: 'Request failed',
      payload: view,
    });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
