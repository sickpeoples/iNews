/**
 * Build a GitHub Pages site from the current Allure 3 Classic report plus
 * complete report artifacts from experiment runs created in the last 7 days.
 *
 * Usage in GitHub Actions: node scripts/build-report-archive.mjs
 * Requirements: Node.js >= 22, GitHub CLI (gh), GITHUB_TOKEN/GH_TOKEN,
 *               actions:read, current-report/index.html, GITHUB_RUN_ID.
 * This script does not change the main production workflow or commit files.
 */
import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const repository = process.env.GITHUB_REPOSITORY;
const branch = process.env.REPORT_ARCHIVE_BRANCH || process.env.GITHUB_REF_NAME;
const currentRunId = process.env.GITHUB_RUN_ID;
const workflowName = process.env.REPORT_ARCHIVE_WORKFLOW || 'allure-experiment.yml';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const retentionDays = Number(process.env.REPORT_ARCHIVE_DAYS || '7');
const currentDir = path.resolve(process.env.REPORT_CURRENT_DIR || './current-report');
const siteDir = path.resolve(process.env.REPORT_SITE_DIR || './site');
const artifactName = 'allure-experiment-report';
const maxSiteBytes = 950_000_000; // Leave some headroom below GitHub Pages' 1 GB limit.

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function escapeHtml(input) {
  return String(input).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

async function isFile(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
}

async function api(endpoint) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'inews-allure-archive-builder',
    },
  });
  if (!response.ok) {
    const message = (await response.text()).slice(0, 400);
    throw new Error(`GitHub API ${response.status} at ${endpoint}: ${message}`);
  }
  return response.json();
}

async function getEligibleRuns(owner, repo, cutoffTime) {
  const eligible = [];
  let reachedOldRuns = false;
  for (let page = 1; page <= 20; page++) {
    const params = new URLSearchParams({
      branch,
      status: 'completed',
      per_page: '100',
      page: String(page),
    });
    const data = await api(`/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflowName)}/runs?${params}`);
    const runs = data.workflow_runs || [];
    for (const run of runs) {
      if (String(run.id) === String(currentRunId)) continue;
      const date = Date.parse(run.created_at);
      if (!Number.isFinite(date)) throw new Error(`Unparseable date on run ${run.id}`);
      if (date < cutoffTime) {
        reachedOldRuns = true;
        continue;
      }
      // Only completed runs of the same experiment branch and workflow.
      if (run.head_branch === branch && run.status === 'completed') eligible.push(run);
    }
    if (runs.length < 100 || reachedOldRuns) return eligible;
  }
  throw new Error('Too many workflow runs to scan safely; no partial archive will be published.');
}

async function getReportArtifact(owner, repo, runId) {
  const params = new URLSearchParams({ name: artifactName, per_page: '100' });
  const data = await api(`/repos/${owner}/${repo}/actions/runs/${runId}/artifacts?${params}`);
  return (data.artifacts || []).find((a) => a.name === artifactName && !a.expired);
}

function downloadArtifact(runId, destination) {
  execFileSync('gh', [
    'run', 'download', String(runId),
    '--repo', repository,
    '--name', artifactName,
    '--dir', destination,
  ], {
    env: { ...process.env, GH_TOKEN: token },
    stdio: 'inherit',
    timeout: 180_000,
  });
}

async function folderSize(folder) {
  let bytes = 0;
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    const child = path.join(folder, entry.name);
    if (entry.isDirectory()) bytes += await folderSize(child);
    else if (entry.isFile()) bytes += (await fs.stat(child)).size;
    else throw new Error(`Unexpected symlink or file type in published site: ${child}`);
  }
  return bytes;
}

function formatJakarta(date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(date));
}

function archivePage(entries, now) {
  const cards = entries.map((run) => {
    const label = run.id === currentRunId ? 'Terbaru' : 'Arsip';
    const outcome = run.conclusion ? ` · Workflow: ${escapeHtml(run.conclusion)}` : '';
    return `<li class="run">
      <div><strong>Run #${escapeHtml(run.id)}</strong><span class="pill">${label}</span>
      <p>${escapeHtml(formatJakarta(run.created_at))} WIB${outcome}</p></div>
      <a href="../runs/${encodeURIComponent(run.id)}/">Buka report lengkap →</a>
    </li>`;
  }).join('\n');
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>iNews QA — Archived Reports</title>
  <style>
    :root{color-scheme:light;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
    body{margin:0;background:#f6f8fb;color:#192333}
    main{max-width:900px;margin:48px auto;padding:0 18px}
    h1{margin-bottom:8px} .muted{color:#5c6878} a{color:#1765b6;text-decoration:none}
    a:hover{text-decoration:underline} ul{list-style:none;margin:24px 0;padding:0}
    .run{background:#fff;border:1px solid #e1e5ed;border-radius:12px;padding:16px 20px;
      display:flex;justify-content:space-between;align-items:center;gap:16px;margin:10px 0}
    .run p{margin:6px 0 0;color:#5c6878;font-size:14px}
    .pill{font-size:12px;background:#e9f3ff;padding:4px 7px;border-radius:20px;margin-left:10px}
    @media(max-width:600px){.run{display:block}.run>a{display:inline-block;margin-top:14px}}
  </style>
</head>
<body><main>
  <p><a href="../">← Kembali ke Latest Report</a></p>
  <h1>Archived Reports — iNews QA</h1>
  <p class="muted">Report lengkap dari 7 × 24 jam terakhir. Waktu ditampilkan dalam WIB.
  History grafik yang lebih lama tetap dapat dilihat di Latest Report selama tersimpan oleh Allure.</p>
  <ul>${cards}</ul>
  <p class="muted">Diperbarui: ${escapeHtml(formatJakarta(now))} WIB. Arsip dihapus dari daftar saat deployment berikutnya setelah melewati 7 hari.</p>
</main></body></html>`;
}

async function insertArchiveLink(indexPath) {
  const html = await fs.readFile(indexPath, 'utf8');
  assert(/<\/body>/i.test(html), 'Latest Allure index.html has no closing body tag');
  const snippet = `<div style="position:fixed;bottom:16px;right:16px;z-index:2147483640;font:600 13px system-ui,sans-serif">
<a href="./archive/" style="display:block;background:#fff;color:#1b5ea9;padding:10px 14px;
box-shadow:0 2px 12px #0002;border:1px solid #cbd5e1;border-radius:10px;text-decoration:none">
📁 Archived Reports (7 hari)</a></div>`;
  await fs.writeFile(indexPath, html.replace(/<\/body>/i, `${snippet}\n</body>`));
}

async function main() {
  assert(repository && repository.includes('/'), 'GITHUB_REPOSITORY is required (owner/repo)');
  assert(branch, 'REPORT_ARCHIVE_BRANCH or GITHUB_REF_NAME is required');
  assert(/^\d+$/.test(currentRunId || ''), 'GITHUB_RUN_ID must contain digits');
  assert(token, 'GITHUB_TOKEN / GH_TOKEN is required');
  assert(Number.isInteger(retentionDays) && retentionDays > 0, 'REPORT_ARCHIVE_DAYS must be a positive integer');
  assert(siteDir !== currentDir, 'Output site path must differ from current report path');
  assert(await isFile(path.join(currentDir, 'index.html')), 'Current report index.html was not downloaded');

  const [owner, repo] = repository.split('/');
  const now = Date.now();
  const cutoff = now - retentionDays * 24 * 60 * 60 * 1000;
  const currentRun = await api(`/repos/${owner}/${repo}/actions/runs/${currentRunId}`);
  assert(currentRun.head_branch === branch, 'Current run does not match experiment branch');
  assert(currentRun.path?.includes(workflowName), 'Current run does not match experiment workflow');

  await fs.rm(siteDir, { recursive: true, force: true });
  await fs.mkdir(siteDir, { recursive: true });
  await fs.cp(currentDir, siteDir, { recursive: true });
  assert(await isFile(path.join(siteDir, 'index.html')), 'Latest report copy failed');

  const runsDir = path.join(siteDir, 'runs');
  await fs.mkdir(runsDir, { recursive: true });
  const currentArchive = path.join(runsDir, currentRunId);
  await fs.cp(currentDir, currentArchive, { recursive: true });
  assert(await isFile(path.join(currentArchive, 'index.html')), 'Current run archive copy failed');

  const entries = [{
    id: currentRunId,
    created_at: currentRun.created_at,
    conclusion: currentRun.conclusion,
  }];
  const candidates = await getEligibleRuns(owner, repo, cutoff);
  console.log(`Found ${candidates.length} completed workflow runs in the last ${retentionDays} days.`);

  for (const run of candidates) {
    const artifact = await getReportArtifact(owner, repo, run.id);
    if (!artifact) {
      console.log(`Skip run ${run.id}: report artifact missing or expired.`);
      continue;
    }
    const runDir = path.join(runsDir, String(run.id));
    await fs.mkdir(runDir, { recursive: true });
    console.log(`Downloading report artifact from run ${run.id}...`);
    downloadArtifact(run.id, runDir);
    assert(await isFile(path.join(runDir, 'index.html')),
      `Run ${run.id} artifact has no index.html; aborting instead of publishing incomplete archive`);
    entries.push({
      id: String(run.id),
      created_at: run.created_at,
      conclusion: run.conclusion,
    });
  }

  entries.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  await fs.mkdir(path.join(siteDir, 'archive'), { recursive: true });
  await fs.writeFile(path.join(siteDir, 'archive', 'index.html'), archivePage(entries, now));
  await fs.writeFile(path.join(siteDir, 'archive', 'manifest.json'), JSON.stringify({
    generatedAt: new Date(now).toISOString(), retentionDays, runs: entries,
  }, null, 2));
  await insertArchiveLink(path.join(siteDir, 'index.html'));

  const bytes = await folderSize(siteDir);
  console.log(`Site includes ${entries.length} reports including latest; size ${(bytes / 1e6).toFixed(1)} MB.`);
  assert(bytes <= maxSiteBytes,
    `Website is ${(bytes / 1e6).toFixed(1)} MB, exceeding safe GitHub Pages budget. No deployment will be made.`);
  console.log(`Archive index ready at ${path.join(siteDir, 'archive', 'index.html')}`);
}

main().catch((error) => {
  console.error('Failed building Allure archive:', error);
  process.exitCode = 1;
});
