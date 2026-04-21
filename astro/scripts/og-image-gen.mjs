// ORGA-058 — generate /og/organizatsiya.jpg + /og/default.jpg via sharp.
// Run once at setup; assets committed to public/og/. Re-run if source changes.
import sharp from 'sharp';

const PUBLIC_OG = new URL('../public/og/', import.meta.url);
const SOURCE = 'C:/tmp/reebok-source.png';

async function makeOrganizatsiya() {
  const out = new URL('organizatsiya.jpg', PUBLIC_OG).pathname.slice(1);
  await sharp(SOURCE)
    .resize(1200, 630, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`organizatsiya.jpg: ${meta.width}×${meta.height}, ${meta.size} bytes`);
}

async function makeDefault() {
  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1A365D"/>
      <stop offset="100%" stop-color="#0F1F35"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <line x1="120" y1="200" x2="280" y2="200" stroke="#D69E2E" stroke-width="3"/>
  <text x="120" y="320"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="78" font-weight="700" fill="#F7FAFC"
        letter-spacing="-1">UNDERGROUND</text>
  <text x="120" y="410"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="78" font-weight="700" fill="#F7FAFC"
        letter-spacing="-1">ACADEMIA</text>
  <text x="120" y="475"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="28" font-style="italic" fill="#68D391"
        letter-spacing="2">Cultural Seismography</text>
  <text x="120" y="560"
        font-family="-apple-system, 'Segoe UI', sans-serif"
        font-size="20" fill="#F7FAFC" opacity="0.65"
        letter-spacing="3">UNDERGROUND.FOLKUP.LIFE</text>
</svg>`);
  const out = new URL('default.jpg', PUBLIC_OG).pathname.slice(1);
  await sharp(svg)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`default.jpg: ${meta.width}×${meta.height}, ${meta.size} bytes`);
}

await makeOrganizatsiya();
await makeDefault();
