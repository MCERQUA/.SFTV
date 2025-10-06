#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Check if ffmpeg is available
function checkFfmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    ffmpeg.on('error', () => resolve(false));
    ffmpeg.on('exit', (code) => resolve(code === 0));
  });
}

// Extract frame from video using ffmpeg
function extractFrame(videoPath, outputPath, timePosition = '00:00:01') {
  return new Promise((resolve, reject) => {
    const args = [
      '-i', videoPath,
      '-ss', timePosition,  // Seek to position
      '-vframes', '1',       // Extract one frame
      '-q:v', '2',          // Quality level (2 is high quality)
      '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
      outputPath,
      '-y'                   // Overwrite output
    ];

    const ffmpeg = spawn('ffmpeg', args);
    let stderr = '';

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`));
      }
    });

    ffmpeg.on('error', reject);
  });
}

// Video mappings with correct paths and thumbnail names
const videoMappings = [
  // Commercial Shorts
  {
    video: 'public/videos/commercial-shorts/Cortex-industries-Rex-oring-game-sm.mp4',
    thumbnail: 'public/thumbnails/commercial-shorts/cortex-rex.jpg'
  },
  {
    video: 'public/videos/commercial-shorts/duckcleaning-commerical.mp4',
    thumbnail: 'public/thumbnails/commercial-shorts/duck-cleaning.jpg'
  },
  {
    video: 'public/videos/commercial-shorts/Graco Fusion AP.mp4',
    thumbnail: 'public/thumbnails/commercial-shorts/graco-fusion.jpg'
  },
  {
    video: 'public/videos/commercial-shorts/koolfoam-fly-south.mp4',
    thumbnail: 'public/thumbnails/commercial-shorts/koolfoam.jpg'
  },
  {
    video: 'public/videos/commercial-shorts/noble-insulation-commerical-sm.mp4',
    thumbnail: 'public/thumbnails/commercial-shorts/noble-insulation.jpg'
  },
  // Commercials Longer
  {
    video: 'public/videos/commercials-longer/EDI-Commerical.mp4',
    thumbnail: 'public/thumbnails/commercials-longer/edi.jpg'
  },
  {
    video: 'public/videos/commercials-longer/ICA-Duct-Clean-Bodywash.mp4',
    thumbnail: 'public/thumbnails/commercials-longer/ica-bodywash.jpg'
  },
  {
    video: 'public/videos/commercials-longer/ICA-Getting-Ducts-Clean.mp4',
    thumbnail: 'public/thumbnails/commercials-longer/ica-ducts.jpg'
  },
  {
    video: 'public/videos/commercials-longer/Only-Foam-SprayFoam-Party.mp4',
    thumbnail: 'public/thumbnails/commercials-longer/foam-party.jpg'
  },
  // Music Video Commercials
  {
    video: 'public/videos/music-video-commercials/Mrs-SprayFoam-Call-Me-Maybe.mp4',
    thumbnail: 'public/thumbnails/music-video-commercials/call-me-maybe.jpg'
  },
  {
    video: 'public/videos/music-video-commercials/Mrs-Sprayfoam-Let-It-Foam.mp4',
    thumbnail: 'public/thumbnails/music-video-commercials/let-it-foam.jpg'
  },
  // Funny Clips
  {
    video: 'public/videos/funny-clips/Breaking-Batts.mp4',
    thumbnail: 'public/thumbnails/funny-clips/breaking-batts.jpg'
  },
  {
    video: 'public/videos/funny-clips/Insulated-chicken-brothers-cartoon.mp4',
    thumbnail: 'public/thumbnails/funny-clips/chicken-brothers-1.jpg'
  },
  {
    video: 'public/videos/funny-clips/Insulated-Chicken-Brothers-Cartoon2.mp4',
    thumbnail: 'public/thumbnails/funny-clips/chicken-brothers-2.jpg'
  }
];

async function main() {
  // Check if ffmpeg is available
  const hasFfmpeg = await checkFfmpeg();

  if (!hasFfmpeg) {
    console.error('❌ ffmpeg is not installed. Please install ffmpeg to extract video frames.');
    console.error('\nTry one of these commands:');
    console.error('  Ubuntu/Debian: sudo apt-get install ffmpeg');
    console.error('  macOS: brew install ffmpeg');
    console.error('  Or download from: https://ffmpeg.org/download.html');
    process.exit(1);
  }

  console.log('🎬 Extracting frames from videos...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const mapping of videoMappings) {
    const videoPath = path.join(__dirname, '..', mapping.video);
    const thumbnailPath = path.join(__dirname, '..', mapping.thumbnail);

    // Check if video exists
    if (!fs.existsSync(videoPath)) {
      console.log(`⚠️  Video not found: ${mapping.video}`);
      errorCount++;
      continue;
    }

    try {
      // Ensure thumbnail directory exists
      const thumbnailDir = path.dirname(thumbnailPath);
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      // Extract frame at 1 second mark
      await extractFrame(videoPath, thumbnailPath, '00:00:01');
      console.log(`✅ Extracted: ${mapping.thumbnail}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to extract ${mapping.thumbnail}: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully extracted: ${successCount} thumbnails`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} thumbnails`);
  }
}

main().catch(console.error);