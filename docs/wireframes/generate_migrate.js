const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const outDir = path.resolve(__dirname, 'images_implementasi');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const template = (content) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    margin: 0;
    padding: 20px;
    background-color: #1e1e1e;
    color: #cccccc;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }
  .prompt { color: #569cd6; } /* Blue for path */
  .cmd { color: #ce9178; }   /* String/yellowish for command */
  .success { color: #4af626; } /* Green */
  .dim { color: #808080; }
  .table { display: table; width: 100%; }
  .row { display: table-row; }
  .cell { display: table-cell; padding-right: 20px; }
</style>
</head>
<body>
  ${content}
</body>
</html>
`;

const migrateContent = `
<div><span class="prompt">PS C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)\\mialhasani-backend></span> <span class="cmd">php artisan migrate</span></div>
<br>
<div><span class="success">  INFO </span> Preparing database.</div>
<br>
<div>  Creating migration table ............................................. 14ms <span class="success">DONE</span></div>
<br>
<div><span class="success">  INFO </span> Running migrations.</div>
<br>
<div class="table">
  <div class="row">
    <div class="cell">  0001_01_01_000000_create_users_table</div>
    <div class="cell">................................ 45ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  0001_01_01_000001_create_cache_table</div>
    <div class="cell">................................ 23ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  0001_01_01_000002_create_jobs_table</div>
    <div class="cell">................................. 31ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  2026_07_12_000000_create_news_table</div>
    <div class="cell">................................. 28ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  2026_07_12_000000_create_galleries_table</div>
    <div class="cell">............................ 24ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  2026_07_12_000000_create_teachers_table</div>
    <div class="cell">............................. 25ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  2026_07_12_000000_create_programs_table</div>
    <div class="cell">............................. 22ms <span class="success">DONE</span></div>
  </div>
  <div class="row">
    <div class="cell">  2026_07_12_000000_create_ppdb_registrations_table</div>
    <div class="cell">................... 36ms <span class="success">DONE</span></div>
  </div>
</div>
<br>
<div><span class="prompt">PS C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)\\mialhasani-backend></span></div>
`;

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 900, height: 450, deviceScaleFactor: 2 });
  await page.setContent(template(migrateContent));
  await page.screenshot({ path: path.join(outDir, 'terminal_migrate.png') });
  
  await browser.close();
  console.log('Migrate terminal screenshot generated successfully!');
})();
