const fs = require('fs');
const path = require('path');
const dir = path.resolve('./source');
const files = fs.readdirSync(dir).filter(f => parseInt(f.split('-')[0]) >= 11 && f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  if (content.includes('<!-- Sidebar -->')) {
     const replacement = `  <div style="margin-top:auto; padding-top:20px; border-top:1px solid #ddd;">
    <div class="menu-item" style="color:#d00; font-weight:bold;"><div class="cross-box" style="width:16px;height:16px;"></div> Logout</div>
  </div>\n</div>`;
     
     if (!content.includes('Logout')) {
       content = content.replace(/\s*<\/div>\s*<!-- Main Content -->/, '\n' + replacement + '\n\n<!-- Main Content -->');
       
       if (content.includes('.sidebar {')) {
          content = content.replace('.sidebar {', '.sidebar { display: flex; flex-direction: column;');
       }
       
       fs.writeFileSync(path.join(dir, file), content);
       console.log('Updated ' + file);
     }
  }
}
