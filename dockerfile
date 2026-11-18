
FROM mcr.microsoft.com/playwright:v1.64.0-noble

WORKDIR /app

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install dependency project ke dalam image
COPY package.json package-lock.json ./
RUN npm ci

# Salin source code automation
COPY . .

# Perintah default ketika container dijalankan
CMD ["sh", "/app/run-qa.sh"]