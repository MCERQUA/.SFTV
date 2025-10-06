#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Videos that need thumbnails
const videosToProcess = [
  {
    video: 'public/videos/funny-clips/Cortez-Rex-Day-Off-Camping.mp4',
    thumbnail: 'public/thumbnails/funny-clips/cortex-rex-camping.jpg',
    title: 'Cortex Rex: Day Off Camping'
  },
  {
    video: 'public/videos/funny-clips/Rex-Camping-Recap.mp4',
    thumbnail: 'public/thumbnails/funny-clips/rex-camping-recap.jpg',
    title: 'Rex Camping Recap'
  },
  {
    video: 'public/videos/funny-clips/Cortex-Rex-Density-Check.mp4',
    thumbnail: 'public/thumbnails/funny-clips/cortex-density-check.jpg',
    title: 'Cortex Rex: Density Check'
  },
  {
    video: 'public/videos/funny-clips/Cortez-Rex-Jobsite-Emergency.mp4',
    thumbnail: 'public/thumbnails/funny-clips/cortex-jobsite-emergency.jpg',
    title: 'Cortex Rex: Jobsite Emergency'
  },
  {
    video: 'public/videos/funny-clips/Mad-Dog-Sprayfoam.mp4',
    thumbnail: 'public/thumbnails/funny-clips/mad-dog-sprayfoam.jpg',
    title: 'Mad Dog SprayFoam'
  }
];

async function generateThumbnail(videoPath, thumbnailPath, title) {
  try {
    // Try using ffmpeg if available
    const cmd = `ffmpeg -i "${videoPath}" -ss 00:00:10 -vframes 1 -vf "scale=1280:720" -q:v 2 "${thumbnailPath}" -y 2>/dev/null`;
    await execPromise(cmd);
    console.log(`✓ Generated thumbnail for ${title}`);
    return true;
  } catch (error) {
    // ffmpeg not available, create placeholder
    console.log(`⚠ Could not generate thumbnail for ${title} - ffmpeg not available`);

    // Create a simple colored placeholder based on the existing thumbnails
    // We'll copy an existing thumbnail as a temporary solution
    const existingThumbnails = [
      'public/thumbnails/funny-clips/breaking-batts.jpg',
      'public/thumbnails/funny-clips/chicken-brothers-1.jpg',
      'public/thumbnails/funny-clips/chicken-brothers-2.jpg'
    ];

    // Use different existing thumbnails for variety
    const sourceIndex = videosToProcess.findIndex(v => v.thumbnail === thumbnailPath) % existingThumbnails.length;
    const sourceThumbnail = existingThumbnails[sourceIndex];

    if (fs.existsSync(sourceThumbnail)) {
      fs.copyFileSync(sourceThumbnail, thumbnailPath);
      console.log(`  → Used placeholder from ${path.basename(sourceThumbnail)}`);
      return true;
    }

    return false;
  }
}

async function main() {
  console.log('Generating thumbnails for new videos...\n');

  for (const item of videosToProcess) {
    if (fs.existsSync(item.video)) {
      await generateThumbnail(item.video, item.thumbnail, item.title);
    } else {
      console.log(`✗ Video not found: ${item.video}`);
    }
  }

  console.log('\nDone! Remember to install ffmpeg for proper thumbnail generation.');
}

main().catch(console.error);