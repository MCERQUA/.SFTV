#!/usr/bin/env node

// Generate static placeholder thumbnails since ffmpeg is not available
// These will be actual image files that load instantly

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Install canvas if not available
const { execSync } = require('child_process');
try {
  require.resolve('canvas');
} catch(e) {
  console.log('Installing canvas package...');
  execSync('pnpm add canvas', { stdio: 'inherit' });
}

const videoData = {
  'commercial-shorts': [
    { filename: 'cortex-rex.jpg', title: 'Cortex Industries - Rex O-Ring Game' },
    { filename: 'duck-cleaning.jpg', title: 'Duck Cleaning Commercial' },
    { filename: 'graco-fusion.jpg', title: 'Graco Fusion AP' },
    { filename: 'koolfoam.jpg', title: 'KoolFoam - Fly South' },
    { filename: 'noble-insulation.jpg', title: 'Noble Insulation' }
  ],
  'commercials-longer': [
    { filename: 'edi.jpg', title: 'EDI Commercial' },
    { filename: 'ica-bodywash.jpg', title: 'ICA Duct Clean Bodywash' },
    { filename: 'ica-ducts.jpg', title: 'ICA Getting Ducts Clean' },
    { filename: 'foam-party.jpg', title: 'Only Foam SprayFoam Party' }
  ],
  'music-video-commercials': [
    { filename: 'call-me-maybe.jpg', title: 'Mrs. SprayFoam - Call Me Maybe' },
    { filename: 'let-it-foam.jpg', title: 'Mrs. SprayFoam - Let It Foam' }
  ],
  'funny-clips': [
    { filename: 'breaking-batts.jpg', title: 'Breaking Batts' },
    { filename: 'chicken-brothers-1.jpg', title: 'Insulated Chicken Brothers' },
    { filename: 'chicken-brothers-2.jpg', title: 'Insulated Chicken Brothers 2' }
  ],
  'shows': [
    { filename: 'foam-files.jpg', title: 'The Foam Files' },
    { filename: 'contractor-chronicles.jpg', title: 'Contractor Chronicles' },
    { filename: 'safety-first.jpg', title: 'Safety First' },
    { filename: 'foam-academy.jpg', title: 'Foam Academy' }
  ]
};

function generatePlaceholderThumbnail(title, outputPath) {
  // Create canvas with 16:9 aspect ratio
  const width = 1280;
  const height = 720;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Generate unique gradient based on title
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = (hash * 137) % 360;
  const hue2 = (hue1 + 60) % 360;

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `hsl(${hue1}, 70%, 50%)`);
  gradient.addColorStop(1, `hsl(${hue2}, 70%, 40%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Add overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Wrap text if too long
  const maxWidth = width * 0.8;
  const words = title.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Draw lines centered
  const lineHeight = 60;
  const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  // Save image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(outputPath, buffer);
  console.log(`✓ Generated: ${outputPath}`);
}

// Generate all thumbnails
console.log('Generating placeholder thumbnails...\n');

for (const [category, items] of Object.entries(videoData)) {
  const outputDir = path.join(__dirname, '..', 'public', 'thumbnails', category);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const item of items) {
    const outputPath = path.join(outputDir, item.filename);
    generatePlaceholderThumbnail(item.title, outputPath);
  }
}

console.log('\n✓ All thumbnails generated successfully!');