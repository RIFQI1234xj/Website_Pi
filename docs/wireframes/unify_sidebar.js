const fs = require('fs');
const path = require('path');

const dir = path.resolve('./source');
const files = fs.readdirSync(dir).filter(f => parseInt(f.split('-')[0]) >= 11 && parseInt(f.split('-')[0]) <= 19 && f.endsWith('.html'));

const newSidebarCss = `/* Sidebar */
  .sidebar { width: 250px; background: #f9f9f9; border-right: 2px solid #999; min-height: 1000px; padding: 20px 0; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; }
  .menu-item { padding: 10px 16px; font-size: 13px; color: #333; display: flex; align-items: center; gap: 12px; cursor: pointer; margin: 2px 12px; border-radius: 6px; }
  .menu-item.active { background: #eee; border: 1px solid #999; font-weight: bold; }`;

function getSidebarHtml(filename) {
  const activeClass = (match) => match ? ' active' : '';

  return `<!-- Sidebar -->
<div class="sidebar">
  <div>
    <!-- Logo -->
    <div style="padding: 0 20px 20px; display: flex; align-items: center; gap: 12px;">
      <div class="cross-box" style="width:36px;height:36px;border-radius:8px;border:none;"></div>
      <div>
        <div style="font-weight:bold; font-size:16px; color:#111;">MI Al-Hasani</div>
        <div style="font-size:11px; color:#777;">Admin Panel</div>
      </div>
    </div>
    
    <!-- Profile Box -->
    <div style="margin: 0 16px 20px; padding: 12px; border: 1px solid #999; border-radius: 8px; display: flex; align-items: center; gap: 12px; background: #eee;">
      <div class="cross-box" style="width:32px;height:32px;border-radius:50%;border:none;"><span>A</span></div>
      <div>
        <div style="font-weight:bold; font-size:13px; color:#111;">Admin Sekolah</div>
        <div style="font-size:10px; color:#777; display:flex; align-items:center; gap:4px;">
          <span style="width:6px;height:6px;background:#999;border-radius:50%;display:inline-block;"></span> Online
        </div>
      </div>
    </div>

    <div style="font-size:10px; font-weight:bold; color:#777; padding:10px 20px 5px; text-transform:uppercase; letter-spacing:1px;">Utama</div>
    <div class="menu-item${activeClass(filename.startsWith('11'))}"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Dashboard</div>
    
    <div style="font-size:10px; font-weight:bold; color:#777; padding:15px 20px 5px; text-transform:uppercase; letter-spacing:1px;">Konten</div>
    <div class="menu-item${activeClass(filename.startsWith('18') || filename.startsWith('19'))}"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Berita & Artikel</div>
    <div class="menu-item${activeClass(filename.startsWith('12') || filename.startsWith('13'))}"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Galeri Foto</div>
    
    <div style="font-size:10px; font-weight:bold; color:#777; padding:15px 20px 5px; text-transform:uppercase; letter-spacing:1px;">Data Sekolah</div>
    <div class="menu-item"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Profil Pimpinan</div>
    <div class="menu-item"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Program Sekolah</div>
    <div class="menu-item"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Data Guru</div>
    <div class="menu-item${activeClass(filename.startsWith('14') || filename.startsWith('15') || filename.startsWith('16'))}"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> PPDB Online</div>
    
    <div style="font-size:10px; font-weight:bold; color:#777; padding:15px 20px 5px; text-transform:uppercase; letter-spacing:1px;">Sistem</div>
    <div class="menu-item${activeClass(filename.startsWith('17'))}"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Pengaturan</div>
  </div>
  
  <div style="margin-top:auto; padding-top:20px; border-top:1px solid #ddd;">
    <div class="menu-item" style="color:#d00; font-weight:bold; margin-bottom: 20px;"><div class="cross-box" style="width:16px;height:16px;border:none;"></div> Logout</div>
  </div>
</div>`;
}

for (const file of files) {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Replace HTML
  content = content.replace(/<!-- Sidebar -->[\s\S]*?<!-- Main/, getSidebarHtml(file) + '\n\n<!-- Main');
  
  // Replace CSS
  content = content.replace(/\/\*\s*Sidebar\s*\*\/[\s\S]*?\/\*\s*Main Content\s*\*\//, newSidebarCss + '\n  \n  /* Main Content */');
  
  fs.writeFileSync(path.join(dir, file), content);
  console.log('Updated ' + file);
}
