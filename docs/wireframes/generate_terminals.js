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
</style>
</head>
<body>
  ${content}
</body>
</html>
`;

const laravelContent = `
<div><span class="prompt">PS C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)></span> <span class="cmd">composer create-project laravel/laravel mialhasani-backend</span></div>
<div>Creating a "laravel/laravel" project at "./mialhasani-backend"</div>
<div>Installing laravel/laravel (v12.0.0)</div>
<div><span class="dim">  - Downloading laravel/laravel (v12.0.0)</span></div>
<div><span class="dim">  - Installing laravel/laravel (v12.0.0): Extracting archive</span></div>
<div>Created project in C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)\\mialhasani-backend</div>
<div>> @php -r "file_exists('.env') || copy('.env.example', '.env');"</div>
<div>> @php artisan key:generate --ansi</div>
<div class="success">Application key set successfully.</div>
<br>
<div><span class="prompt">PS C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)></span></div>
`;

const reactContent = `
<div><span class="prompt">PS C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)></span> <span class="cmd">npm create vite@latest Project_pi -- --template react-ts</span></div>
<br>
<div>> npx</div>
<div>> create-vite Project_pi --template react-ts</div>
<br>
<div class="success">Scaffolding project in C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)\\Project_pi...</div>
<br>
<div>Done. Now run:</div>
<br>
<div class="success">  cd Project_pi</div>
<div class="success">  npm install</div>
<div class="success">  npm run dev</div>
<br>
<div><span class="prompt">PS C:\\Users\\Lenovo\\Documents\\project\\backup pi\\Project_PiSekolah - Copy (2)></span></div>
`;

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  
  // Laravel
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 900, height: 400, deviceScaleFactor: 2 });
  await page1.setContent(template(laravelContent));
  await page1.screenshot({ path: path.join(outDir, 'terminal_laravel.png') });
  
  // React
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 900, height: 400, deviceScaleFactor: 2 });
  await page2.setContent(template(reactContent));
  await page2.screenshot({ path: path.join(outDir, 'terminal_react.png') });
  
  await browser.close();
  console.log('Terminal screenshots generated successfully!');
})();
