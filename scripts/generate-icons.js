/**
 * PWA Icon Generator for Cadence
 *
 * Generates PNG icons from an SVG template.
 * Run: node scripts/generate-icons.js
 *
 * Requires: npm install sharp (dev dependency)
 */

const fs = require('fs');
const path = require('path');

// Cadence "C" logo — black background, white bold letter
function createSvg(size) {
  const fontSize = Math.round(size * 0.55);
  const y = Math.round(size * 0.6);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="${Math.round(size * 0.12)}"/>
  <text x="50%" y="${y}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="${fontSize}" fill="#ffffff">C</text>
</svg>`;
}

function createMaskableSvg(size) {
  // Maskable icons need a safe zone (inner 80%)
  const fontSize = Math.round(size * 0.45);
  const y = Math.round(size * 0.58);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="${y}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="${fontSize}" fill="#ffffff">C</text>
</svg>`;
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

async function main() {
  try {
    const sharp = require('sharp');

    const icons = [
      { name: 'icon-192x192.png', size: 192, maskable: false },
      { name: 'icon-512x512.png', size: 512, maskable: false },
      { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
      { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
      { name: 'apple-touch-icon.png', size: 180, maskable: false },
    ];

    for (const icon of icons) {
      const svg = icon.maskable ? createMaskableSvg(icon.size) : createSvg(icon.size);
      await sharp(Buffer.from(svg)).png().toFile(path.join(iconsDir, icon.name));
      console.log(`Created ${icon.name}`);
    }

    // Also create favicon.ico (32x32 PNG served as ico)
    const faviconSvg = createSvg(32);
    await sharp(Buffer.from(faviconSvg)).png().toFile(path.join(iconsDir, '..', 'favicon.png'));
    console.log('Created favicon.png');

    console.log('\nAll icons generated successfully!');
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      // Fallback: write SVG files directly if sharp isn't installed
      console.log('sharp not found — writing SVG fallbacks instead');
      console.log('Run "npm install -D sharp" then re-run this script for PNG output\n');

      const sizes = [
        { name: 'icon-192x192.svg', size: 192, maskable: false },
        { name: 'icon-512x512.svg', size: 512, maskable: false },
        { name: 'icon-maskable-192x192.svg', size: 192, maskable: true },
        { name: 'icon-maskable-512x512.svg', size: 512, maskable: true },
        { name: 'apple-touch-icon.svg', size: 180, maskable: false },
      ];

      for (const s of sizes) {
        const svg = s.maskable ? createMaskableSvg(s.size) : createSvg(s.size);
        fs.writeFileSync(path.join(iconsDir, s.name), svg);
        console.log(`Created ${s.name} (SVG fallback)`);
      }
    } else {
      throw e;
    }
  }
}

main();
