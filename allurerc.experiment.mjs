import { defineConfig } from 'allure';

export default defineConfig({
  name: 'iNews QA Experiment',
  output: './allure-report-experiment',
  historyPath: './allure-history/history.jsonl',
  appendHistory: true,
  historyLimit: 30,
  plugins: {
    allure2: {
      options: {
        reportName: 'iNews QA — Classic Experiment',
        reportLanguage: 'en',
        singleFile: false,
      },
    },
  },
});
