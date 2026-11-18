
# Pengaturan masa penyimpanan arsip
$retentionDays = 7

# Lokasi folder
$source = "$PSScriptRoot\allure-report"
$archive = "$PSScriptRoot\allure-archive"

# Pastikan report tersedia
if (!(Test-Path "$source\index.html")) {
    Write-Host "ERROR: Allure Report belum tersedia."
    exit 1
}

# Buat folder arsip jika belum ada
New-Item -ItemType Directory -Force -Path $archive | Out-Null

# Nama arsip menggunakan tanggal dan jam
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$destination = "$archive\run-$timestamp"

# Buat folder arsip untuk run ini
New-Item -ItemType Directory -Path $destination | Out-Null

# Salin semua isi report terbaru
Copy-Item "$source\*" -Destination $destination -Recurse -Force

Write-Host "Report berhasil diarsipkan: run-$timestamp"

# Hapus arsip yang usianya melebihi batas
$cutoff = (Get-Date).AddDays(-$retentionDays)

Get-ChildItem $archive -Directory |
    Where-Object {
        $_.Name -like "run-*" -and
        $_.CreationTime -lt $cutoff
    } |
    ForEach-Object {
        Write-Host "Menghapus arsip lama: $($_.Name)"
        Remove-Item $_.FullName -Recurse -Force
    }

Write-Host "Selesai! Retensi arsip: $retentionDays hari"
