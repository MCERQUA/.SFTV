#!/bin/bash

# Script to generate thumbnails from videos using ffmpeg
# Run this script when ffmpeg is available

echo "Generating thumbnails from videos..."

# Function to generate thumbnail
generate_thumbnail() {
    local video_path="$1"
    local thumbnail_path="$2"

    # Extract frame at 1 second mark as thumbnail
    ffmpeg -i "$video_path" -ss 00:00:01 -vframes 1 -vf "scale=1280:720" "$thumbnail_path" -y 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "✓ Generated: $thumbnail_path"
    else
        echo "✗ Failed: $video_path"
    fi
}

# Commercial Shorts
for video in public/videos/commercial-shorts/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" .mp4)
        generate_thumbnail "$video" "public/thumbnails/commercial-shorts/${filename}.jpg"
    fi
done

# Commercials Longer
for video in public/videos/commercials-longer/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" .mp4)
        generate_thumbnail "$video" "public/thumbnails/commercials-longer/${filename}.jpg"
    fi
done

# Music Video Commercials
for video in public/videos/music-video-commercials/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" .mp4)
        generate_thumbnail "$video" "public/thumbnails/music-video-commercials/${filename}.jpg"
    fi
done

# Funny Clips
for video in public/videos/funny-clips/*.mp4; do
    if [ -f "$video" ]; then
        filename=$(basename "$video" .mp4)
        generate_thumbnail "$video" "public/thumbnails/funny-clips/${filename}.jpg"
    fi
done

echo "Thumbnail generation complete!"