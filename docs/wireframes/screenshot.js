const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const sourceDir = path.join(__dirname, 'source');
const outputDir = path.join(__dirname, 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir)
  .filter(f => f.endsWith('.html'))
  .sort();

(async () => {
  console.log(`\n🚀 Memulai screenshot ${files.length} wireframe...\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');
    const outputName = file.replace('.html', '.png');
    const outputPath = path.join(outputDir, outputName);

    const page = await browser.newPage();

    // Set viewport lebar 1600px agar layout tidak berubah
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });

    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Ambil tinggi penuh konten halaman
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: 1600, height: bodyHeight, deviceScaleFactor: 1 });

    // Screenshot full page, tidak terpotong
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      type: 'png'
    });

    await page.close();
    console.log(`  ✓ ${file}  →  images/${outputName}`);
  }

  await browser.close();
  console.log(`\n✅ Selesai! Semua gambar tersimpan di folder: images/\n`);
})();
