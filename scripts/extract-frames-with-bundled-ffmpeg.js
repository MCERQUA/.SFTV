#!/usr/bin/env node

const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

// Set ffmpeg path from the installer
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

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

function extractFrame(videoPath, thumbnailPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['00:00:01'],  // Take screenshot at 1 second
        filename: path.basename(thumbnailPath),
        folder: path.dirname(thumbnailPath),
        size: '1280x720'
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function main() {
  console.log('🎬 Extracting actual frames from videos...\n');

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

      await extractFrame(videoPath, thumbnailPath);
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