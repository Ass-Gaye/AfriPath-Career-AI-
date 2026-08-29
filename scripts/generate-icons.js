import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPngBuffer(width, height, drawFn) {
  // RGBA buffer
  const stride = width * 4;
  const rawData = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    rawData[rowStart] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowStart + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });

  // Helper to make PNG chunk
  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);

    // Calculate CRC32
    const crcData = Buffer.concat([typeBuf, data]);
    const crc = crc32(crcData);
    crcBuf.writeUInt32BE(crc >>> 0, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // Simple CRC32 implementation
  function crc32(buf) {
    let table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression method: 0
  ihdr[11] = 0; // Filter method: 0
  ihdr[12] = 0; // Interlace: 0

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflated),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Distance helper
function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// Distance from point to line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return dist(px, py, x1, y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist(px, py, x1 + t * dx, y1 + t * dy);
}

// Draw AfriPath Icon
function createAfriPathIcon(isMaskable = false) {
  return (x, y, w, h) => {
    // Normalize coordinates to 0..100
    const nx = (x / w) * 100;
    const ny = (y / h) * 100;

    // Background gradient: Rich Emerald / Slate (#064e3b -> #047857 -> #059669)
    const gradFactor = (nx + ny) / 200;
    let bgR = Math.round(6 + gradFactor * (5 - 6));
    let bgG = Math.round(78 + gradFactor * (150 - 78));
    let bgB = Math.round(59 + gradFactor * (105 - 59));
    let bgA = 255;

    // Corner radius for non-maskable (standard app icon squircle)
    if (!isMaskable) {
      const radius = 22;
      let dx = 0;
      let dy = 0;
      if (nx < radius) dx = radius - nx;
      else if (nx > 100 - radius) dx = nx - (100 - radius);
      if (ny < radius) dy = radius - ny;
      else if (ny > 100 - radius) dy = ny - (100 - radius);

      if (dx > 0 && dy > 0) {
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > radius) {
          return [0, 0, 0, 0]; // Transparent outside squircle
        } else if (d > radius - 1.5) {
          // Antialiasing edge
          const alphaFactor = Math.max(0, Math.min(1, (radius - d) / 1.5));
          bgA = Math.round(255 * alphaFactor);
        }
      }
    }

    // Geometry scaling: if maskable, scale to safe area (0.7 scale centered)
    const scale = isMaskable ? 0.72 : 0.88;
    const cx = 50;
    const cy = 50;
    const gx = (nx - cx) / scale + cx;
    const gy = (ny - cy) / scale + cy;

    // Path "A" geometry in gx, gy coordinates (range ~ 0..100)
    // Peak: (50, 24)
    // Left leg base: (24, 76)
    // Right leg base: (76, 76)
    // Crossbar: from (34, 58) to (66, 58)
    // Apex circle: center (50, 24), radius 6.5

    const strokeWidth = 7.5;
    const leftDist = distToSegment(gx, gy, 50, 24, 24, 76);
    const rightDist = distToSegment(gx, gy, 50, 24, 76, 76);
    const legMinDist = Math.min(leftDist, rightDist);

    const crossDist = distToSegment(gx, gy, 33, 58, 67, 58);
    const apexDist = dist(gx, gy, 50, 24);

    // 1. Apex Golden Sun/Star circle
    if (apexDist <= 6.8) {
      const aa = Math.max(0, Math.min(1, (7.2 - apexDist) / 0.8));
      return [245, 158, 11, Math.round(255 * aa)]; // #F59E0B Amber Gold
    }

    // 2. Amber/Gold Crossbar Bridge (Pathway connection)
    if (crossDist <= strokeWidth / 2 + 0.4) {
      const aa = Math.max(0, Math.min(1, (strokeWidth / 2 + 0.6 - crossDist) / 0.8));
      return [245, 158, 11, Math.round(255 * aa)]; // #F59E0B
    }

    // 3. White "A" Ascending Pathway Pillars
    if (legMinDist <= strokeWidth / 2 + 0.4) {
      const aa = Math.max(0, Math.min(1, (strokeWidth / 2 + 0.6 - legMinDist) / 0.8));
      return [255, 255, 255, Math.round(255 * aa)]; // Crisp White
    }

    // Background
    return [bgR, bgG, bgB, bgA];
  };
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
console.log('Generating AfriPath AI PWA Icons...');

const icons = [
  { file: 'favicon-16x16.png', size: 16, maskable: false },
  { file: 'favicon-32x32.png', size: 32, maskable: false },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable.png', size: 512, maskable: true },
];

for (const icon of icons) {
  const buf = createPngBuffer(icon.size, icon.size, createAfriPathIcon(icon.maskable));
  const targetPath = path.join(publicDir, icon.file);
  fs.writeFileSync(targetPath, buf);
  console.log(`✓ Created ${icon.file} (${icon.size}x${icon.size}, ${buf.length} bytes)`);
}

// Also create a 32x32 favicon.ico (standard ICO format with single 32x32 PNG inside)
const png32 = fs.readFileSync(path.join(publicDir, 'favicon-32x32.png'));
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // reserved
icoHeader.writeUInt16LE(1, 2); // type 1 = ICO
icoHeader.writeUInt16LE(1, 4); // 1 image

const icoDirEntry = Buffer.alloc(16);
icoDirEntry.writeUInt8(32, 0); // width 32
icoDirEntry.writeUInt8(32, 1); // height 32
icoDirEntry.writeUInt8(0, 2); // color palette (0 = >=256 colors)
icoDirEntry.writeUInt8(0, 3); // reserved
icoDirEntry.writeUInt16LE(1, 4); // color planes
icoDirEntry.writeUInt16LE(32, 6); // bits per pixel
icoDirEntry.writeUInt32LE(png32.length, 8); // size of image data in bytes
icoDirEntry.writeUInt32LE(6 + 16, 12); // offset of image data

const icoBuf = Buffer.concat([icoHeader, icoDirEntry, png32]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
console.log(`✓ Created favicon.ico (${icoBuf.length} bytes)`);

console.log('All PWA Icons generated successfully!');
