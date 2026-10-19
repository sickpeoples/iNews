iNews - Allure experiment (manual only)

1. Use branch experiment/allure-report.
2. Confirm allure-commandline has been uninstalled and package-lock.json updated.
3. Add allurerc.experiment.mjs and .github/workflows/allure-experiment.yml to that branch.
4. Commit and push those files to experiment/allure-report.
5. To make the manual Run workflow button available, copy ONLY the workflow YAML file to the repository's default branch. Do NOT merge the experiment branch into main or change daily-automation.
6. Actions -> Allure Report Experiment -> Run workflow -> choose experiment/allure-report, publish_pages=false.
7. Run a second time with publish_pages=false. Confirm artifact allure-experiment-history is restored; the history JSONL should contain two runs.
8. After validation, run with publish_pages=true to publish to GitHub Pages.

Important: GitHub Pages will replace the previous site on this repository's Pages URL. Keep false until ready.
Important: Validate that generated report exists at allure-report-experiment/allure2/index.html. Allure 3's allure2 plugin is experimental.
