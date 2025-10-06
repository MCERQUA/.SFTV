#!/bin/bash

# Ensure ffmpeg is in PATH
export PATH="$HOME/.local/bin:$PATH"

echo "Getting video durations..."
echo "========================="

# Function to get duration in MM:SS format
get_duration() {
    local video_path="$1"
    local duration_seconds=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$video_path" 2>/dev/null)

    if [ -z "$duration_seconds" ]; then
        echo "--:--"
    else
        # Convert to MM:SS format
        local minutes=$(echo "$duration_seconds / 60" | bc)
        local seconds=$(echo "$duration_seconds % 60" | bc | cut -d. -f1)
        printf "%d:%02d" $minutes $seconds
    fi
}

echo "Commercial Shorts:"
echo "----------------"
for video in public/videos/commercial-shorts/*.mp4; do
    filename=$(basename "$video")
    duration=$(get_duration "$video")
    echo "$filename: $duration"
done

echo ""
echo "Commercials Longer:"
echo "------------------"
for video in public/videos/commercials-longer/*.mp4; do
    filename=$(basename "$video")
    duration=$(get_duration "$video")
    echo "$filename: $duration"
done

echo ""
echo "Music Video Commercials:"
echo "-----------------------"
for video in public/videos/music-video-commercials/*.mp4; do
    filename=$(basename "$video")
    duration=$(get_duration "$video")
    echo "$filename: $duration"
done

echo ""
echo "Funny Clips:"
echo "-----------"
for video in public/videos/funny-clips/*.mp4; do
    filename=$(basename "$video")
    duration=$(get_duration "$video")
    echo "$filename: $duration"
done