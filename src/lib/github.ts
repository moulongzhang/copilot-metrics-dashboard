import {
  CopilotMetricsDay,
  UsageReportResponse,
  CopilotSeatsResponse,
  CopilotSeat,
  OrgMember,
  OrgUsageReport,
  UserUsageRecord,
} from './types';

const GITHUB_API_BASE = 'https://api.github.com';
const API_VERSION = '2022-11-28';

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN environment variable is not set');
  return {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': API_VERSION,
  };
}

function getOrg(): string {
  return process.env.GITHUB_ORG || 'octodemo';
}

// Fetch org-level Copilot metrics (GA API)
export async function fetchOrgMetrics(
  since?: string,
  until?: string,
  page = 1,
  perPage = 28,
): Promise<CopilotMetricsDay[]> {
  const org = getOrg();
  const params = new URLSearchParams();
  if (since) params.set('since', since);
  if (until) params.set('until', until);
  params.set('page', String(page));
  params.set('per_page', String(perPage));

  const url = `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics?${params}`;
  const res = await fetch(url, { headers: getHeaders(), next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Fetch usage report download links (organization level)
export async function fetchOrgUsageReport(day?: string): Promise<UsageReportResponse> {
  const org = getOrg();
  let url: string;
  if (day) {
    url = `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics/reports/organization-1-day?day=${day}`;
  } else {
    url = `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics/reports/organization-28-day/latest`;
  }
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Fetch user usage report download links (organization level)
export async function fetchUserUsageReport(day?: string): Promise<UsageReportResponse> {
  const org = getOrg();
  let url: string;
  if (day) {
    url = `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics/reports/users-1-day?day=${day}`;
  } else {
    url = `${GITHUB_API_BASE}/orgs/${org}/copilot/metrics/reports/users-28-day/latest`;
  }
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// Download and parse NDJSON report
export async function downloadAndParseNDJSON<T>(downloadLinks: string[]): Promise<T[]> {
  const results: T[] = [];
  for (const link of downloadLinks) {
    const res = await fetch(link);
    if (!res.ok) throw new Error(`Failed to download report: ${res.status}`);
    const text = await res.text();
    const lines = text.trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        results.push(JSON.parse(line) as T);
      }
    }
  }
  return results;
}

// Fetch all Copilot seats with pagination
export async function fetchAllSeats(): Promise<CopilotSeat[]> {
  const org = getOrg();
  const allSeats: CopilotSeat[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${GITHUB_API_BASE}/orgs/${org}/copilot/billing/seats?page=${page}&per_page=${perPage}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    const data: CopilotSeatsResponse = await res.json();
    allSeats.push(...data.seats);
    if (allSeats.length >= data.total_seats || data.seats.length < perPage) break;
    page++;
  }
  return allSeats;
}

// Fetch and parse org usage report data
export async function fetchOrgUsageData(): Promise<OrgUsageReport> {
  const report = await fetchOrgUsageReport();
  if (!report.download_links || report.download_links.length === 0) {
    throw new Error('No download links available in org usage report');
  }
  const records = await downloadAndParseNDJSON<OrgUsageReport>(report.download_links);
  if (records.length === 0) {
    throw new Error('No data in org usage report');
  }
  // The org report is a single JSON object (not multiple NDJSON lines)
  return records[0];
}

// Fetch and parse user usage report data
export async function fetchUserUsageData(): Promise<UserUsageRecord[]> {
  const report = await fetchUserUsageReport();
  if (!report.download_links || report.download_links.length === 0) {
    throw new Error('No download links available in user usage report');
  }
  return downloadAndParseNDJSON<UserUsageRecord>(report.download_links);
}

// Fetch all org members with pagination
export async function fetchAllMembers(): Promise<OrgMember[]> {
  const org = getOrg();
  const allMembers: OrgMember[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${GITHUB_API_BASE}/orgs/${org}/members?page=${page}&per_page=${perPage}`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    const members: OrgMember[] = await res.json();
    allMembers.push(...members);
    if (members.length < perPage) break;
    page++;
  }
  return allMembers;
}
