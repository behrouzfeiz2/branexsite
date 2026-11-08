const fs = require('fs');
const path = require('path');

const customersDir = path.join(__dirname, 'customers');
const manifestPath = path.join(customersDir, 'manifest.json');

if (!fs.existsSync(customersDir)) {
  fs.mkdirSync(customersDir, { recursive: true });
}

// خواندن توضیحات قبلی از manifest.json در صورت وجود
let existingManifest = [];
if (fs.existsSync(manifestPath)) {
  try {
    existingManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    existingManifest = [];
  }
}

const existingMap = new Map();
existingManifest.forEach((item) => {
  if (item && item.file) {
    existingMap.set(item.file, item);
  }
});

// اسکن خودکار تمام تصاویر داخل پوشه customers
const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
const files = fs.readdirSync(customersDir).filter((file) => {
  const ext = path.extname(file).toLowerCase();
  return allowedExts.includes(ext);
});

const updatedManifest = files.map((file) => {
  if (existingMap.has(file)) {
    return existingMap.get(file);
  }
  const cleanName = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
  return {
    file,
    name: cleanName,
    description: 'همراه خانواده برانکس'
  };
});

// اگر هنوز فایلی در پوشه نبود، لیست پیش‌فرض حفظ شود
const finalOutput = updatedManifest.length > 0 ? updatedManifest : existingManifest;

fs.writeFileSync(manifestPath, JSON.stringify(finalOutput, null, 2), 'utf8');
console.log(`Updated customers/manifest.json with ${finalOutput.length} items.`);
