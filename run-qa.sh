
#!/bin/sh

cd /app || exit 1

# 1. Pastikan folder tersedia
mkdir -p allure-results
mkdir -p allure-report
mkdir -p allure-history

# 2. Bersihkan hasil test lama
echo "1. Membersihkan Allure Results..."
find allure-results -mindepth 1 -delete || exit 1

# 3. Jalankan Playwright
echo "2. Menjalankan Playwright..."

npx playwright test \
  --project="Desktop Chrome" \
  --grep="${TAG:-@smoke}" \
  --workers=1

TEST_STATUS=$?

# Pastikan terdapat hasil pengujian
if ! find allure-results -name '*-result.json' | grep -q .; then
  echo "ERROR: Tidak ada hasil pengujian Allure."
  exit 1
fi

# 4. Bersihkan report sebelumnya
echo "3. Membersihkan Allure Report..."
find allure-report -mindepth 1 -delete || exit 1

# 5. Generate Allure Report
echo "4. Generate Allure Report..."

npx allure generate allure-results \
  --config allurerc.experiment.mjs

REPORT_STATUS=$?

if [ "$REPORT_STATUS" -ne 0 ]; then
  echo "ERROR: Gagal membuat Allure Report."
  exit "$REPORT_STATUS"
fi

echo "Allure Report berhasil dibuat."

# 6 Push Allure-Archive

echo "5. Mengarsipkan Allure Report"

sh ./archive-report.sh || exit 1

echo "Archive Allure Report selesai."

# Tetap laporkan status asli Playwright
exit "$TEST_STATUS"
