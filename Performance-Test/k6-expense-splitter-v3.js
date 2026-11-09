import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ---------- CONFIG (all overridable with -e) ----------
const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:8000';
const API = __ENV.API_PREFIX !== undefined ? __ENV.API_PREFIX : '/api'; // set -e API_PREFIX="" if groups live at /groups/
const GROUP_ID_ENV = __ENV.GROUP_ID; // optional; auto-detected if omitted
const TEST_TYPE = __ENV.TEST_TYPE || 'smoke'; // smoke | load | stress | spike
const LOGIN_FIELD = __ENV.LOGIN_FIELD || 'username'; // use 'email' if your login expects email
const LOGIN_ID = __ENV.LOGIN_ID;          // username or email
const PASSWORD = __ENV.PASSWORD;
const EXPENSE_BODY = __ENV.EXPENSE_BODY;  // optional JSON string; enables add-expense writes
// ------------------------------------------------------

const errorRate = new Rate('errors');
const addExpenseTime = new Trend('add_expense_duration', true);

const profiles = {
  smoke: { executor: 'constant-vus', vus: 1, duration: '30s' },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 25 },
      { duration: '3m', target: 50 },
      { duration: '1m', target: 0 },
    ],
  },
  stress: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '2m', target: 200 },
      { duration: '1m', target: 0 },
    ],
  },
  spike: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '20s', target: 10 },
      { duration: '10s', target: 200 },
      { duration: '1m', target: 200 },
      { duration: '20s', target: 10 },
      { duration: '20s', target: 0 },
    ],
  },
};

export const options = {
  scenarios: { main: profiles[TEST_TYPE] },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.01'],
  },
};

// Login once, share the access token with all VUs
export function setup() {
  if (!LOGIN_ID || !PASSWORD) {
    throw new Error('Pass credentials: -e LOGIN_ID=your_user -e PASSWORD=your_password');
  }
  const res = http.post(
    `${BASE_URL}${API}/users/token/`,
    JSON.stringify({ [LOGIN_FIELD]: LOGIN_ID, password: PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  const access = res.status === 200 ? res.json('access') : null;
  if (!access) {
    throw new Error(`Login failed (${res.status}): ${res.body}`);
  }

  const pre = http.get(`${BASE_URL}${API}/groups/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  if (pre.status !== 200) {
    throw new Error(`GET ${API}/groups/ returned ${pre.status}. Check API_PREFIX. Body: ${pre.body}`);
  }

  const body = pre.json();
  const groups = Array.isArray(body) ? body : body.results || [];
  let groupId = GROUP_ID_ENV;
  if (!groupId) {
    const usable = groups.find((g) => (g.member_count || 0) >= 2) || groups[0];
    if (!usable) {
      throw new Error('No groups found for this user. Create a group with 2+ members in the app first.');
    }
    groupId = String(usable.id);
  }
  console.log(`Using group ${groupId} (visible groups: ${groups.map((g) => g.id + ':' + g.member_count).join(', ')})`);
  return { access, groupId };
}

export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.access}`,
      'Content-Type': 'application/json',
    },
  };
  const g = `${BASE_URL}${API}/groups`;

  const reads = [
    ['groups list', `${g}/`],
    ['group detail', `${g}/${data.groupId}/`],
    ['group members', `${g}/${data.groupId}/members/`],
    ['group expenses', `${g}/${data.groupId}/expenses/`],
    ['group summary', `${g}/${data.groupId}/summary/`],
  ];

  for (const [name, url] of reads) {
    group(name, () => {
      const r = http.get(url, params);
      errorRate.add(!check(r, { [`${name} 200`]: (x) => x.status === 200 }));
    });
  }

  if (EXPENSE_BODY) {
    group('add expense', () => {
      const r = http.post(`${g}/${data.groupId}/add-expense/`, EXPENSE_BODY, params);
      addExpenseTime.add(r.timings.duration);
      errorRate.add(!check(r, { 'expense created': (x) => x.status === 200 || x.status === 201 }));
    });
  }

  sleep(1);
}

export function handleSummary(data) {
  const m = data.metrics;
  const v = (k, s) => (m[k] && m[k].values[s] !== undefined ? m[k].values[s].toFixed(2) : 'n/a');
  const text = `
===== RESUME NUMBERS (${TEST_TYPE}) =====
Peak VUs           : ${v('vus_max', 'max')}
Total requests     : ${m.http_reqs.values.count}
Throughput (req/s) : ${v('http_reqs', 'rate')}
Avg latency (ms)   : ${v('http_req_duration', 'avg')}
p95 latency (ms)   : ${v('http_req_duration', 'p(95)')}
p99 latency (ms)   : ${v('http_req_duration', 'p(99)')}
Failed requests    : ${(m.http_req_failed.values.rate * 100).toFixed(2)}%
=========================================
`;
  return {
    stdout: text,
    [`summary-${TEST_TYPE}.json`]: JSON.stringify(data, null, 2),
  };
}