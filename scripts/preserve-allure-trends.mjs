import fs from 'node:fs';
import path from 'node:path';

const widgetsDir = 'allure-report-experiment/widgets';
const trendsDir = 'allure-history/trends';

const files = [
    'duration-trend.json',
    'retry-trend.json',
    'categories-trend.json'
];

const runNumber = Number(process.env.GITHUB_RUN_NUMBER);
const runId = process.env.GITHUB_RUN_ID;
const repo = process.env.GITHUB_REPOSITORY;

if (!Number.isInteger(runNumber) || !runId || !repo) {
    throw new Error('GitHub Actions metadata is missing');
}

const identity = {
    buildOrder: runNumber,
    reportName: `iNews QA Run #${runNumber}`,
    reportUrl: `https://github.com/${repo}/actions/runs/${runId}`
};

const readJson = (file) =>
    JSON.parse(fs.readFileSync(file, 'utf8'));

fs.mkdirSync(trendsDir, { recursive: true });

// Cadangan kategori jika generator Classic tidak
// menghasilkan klasifikasi tetapi memiliki hasil gagal.
function fallbackCategories() {
    const counts = {};

    const resultFiles = fs.readdirSync('allure-results')
        .filter(name => name.endsWith('-result.json'));

    for (const name of resultFiles) {
        const result = readJson(
            path.join('allure-results', name)
        );

        const category =
            result.status === 'failed' ? 'Product errors' :
            result.status === 'broken' ? 'Test errors' :
            null;

        if (category) {
            counts[category] = (counts[category] ?? 0) + 1;
        }
    }

    return counts;
}

for (const filename of files) {
    const reportFile = path.join(widgetsDir, filename);
    const historyFile = path.join(trendsDir, filename);

    // Hasil yang baru dibuat oleh Allure
    const current = readJson(reportFile);

    if (!Array.isArray(current) || current.length === 0) {
        throw new Error(`Invalid trend data: ${filename}`);
    }

    // Histori dari artifact run sebelumnya
    const previous = fs.existsSync(historyFile)
        ? readJson(historyFile)
        : [];

    if (!Array.isArray(previous)) {
        throw new Error(`Invalid saved history: ${filename}`);
    }

    let data = current[0].data ?? {};

    // Fallback berdasarkan status hasil test aktual
    if (
        filename === 'categories-trend.json' &&
        Object.keys(data).length === 0
    ) {
        data = fallbackCategories();
    }

    const latest = {
        ...current[0],
        ...identity,
        data
    };

    // Hindari duplikasi run yang sama
    const older = previous.filter(
        item => item.buildOrder !== runNumber
    );

    // Simpan 20 titik trend terbaru
    const combined = [latest, ...older].slice(0, 20);

    fs.writeFileSync(
        reportFile,
        JSON.stringify(combined, null, 2)
    );

    fs.writeFileSync(
        historyFile,
        JSON.stringify(combined, null, 2)
    );

    console.log(
        `${filename}: ${combined.length} run(s) saved`
    );
}
