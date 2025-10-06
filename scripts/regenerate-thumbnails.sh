#!/bin/bash

# Ensure ffmpeg is in PATH
export PATH="$HOME/.local/bin:$PATH"

echo "Regenerating thumbnails for new videos..."

# Cortex Rex videos
ffmpeg -i "public/videos/funny-clips/Cortez-Rex-Day-Off-Camping.mp4" -ss 00:00:10 -vframes 1 -vf "scale=1280:720" -q:v 2 "public/thumbnails/funny-clips/cortex-rex-camping.jpg" -y
echo "✓ Generated thumbnail for Cortex Rex: Day Off Camping"

ffmpeg -i "public/videos/funny-clips/Rex-Camping-Recap.mp4" -ss 00:00:10 -vframes 1 -vf "scale=1280:720" -q:v 2 "public/thumbnails/funny-clips/rex-camping-recap.jpg" -y
echo "✓ Generated thumbnail for Rex Camping Recap"

ffmpeg -i "public/videos/funny-clips/Cortex-Rex-Density-Check.mp4" -ss 00:00:05 -vframes 1 -vf "scale=1280:720" -q:v 2 "public/thumbnails/funny-clips/cortex-density-check.jpg" -y
echo "✓ Generated thumbnail for Cortex Rex: Density Check"

ffmpeg -i "public/videos/funny-clips/Cortez-Rex-Jobsite-Emergency.mp4" -ss 00:00:05 -vframes 1 -vf "scale=1280:720" -q:v 2 "public/thumbnails/funny-clips/cortex-jobsite-emergency.jpg" -y
echo "✓ Generated thumbnail for Cortex Rex: Jobsite Emergency"

ffmpeg -i "public/videos/funny-clips/Mad-Dog-Sprayfoam.mp4" -ss 00:00:05 -vframes 1 -vf "scale=1280:720" -q:v 2 "public/thumbnails/funny-clips/mad-dog-sprayfoam.jpg" -y
echo "✓ Generated thumbnail for Mad Dog SprayFoam"

# Clean up test thumbnail
rm -f public/thumbnails/funny-clips/mad-dog-test.jpg

echo "All thumbnails regenerated successfully!"