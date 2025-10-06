// Component to generate placeholder thumbnail with gradient and text

interface PlaceholderThumbnailProps {
  title: string
  category?: string
}

export function PlaceholderThumbnail({ title, category }: PlaceholderThumbnailProps) {
  // Generate a unique gradient based on title
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue1 = (hash * 137) % 360
  const hue2 = (hue1 + 60) % 360

  return (
    <div
      className="relative h-full w-full flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 40%))`
      }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative text-center p-4">
        <div className="text-white/90 text-lg font-semibold drop-shadow-lg">
          {title}
        </div>
        {category && (
          <div className="text-white/70 text-sm mt-1 drop-shadow">
            {category}
          </div>
        )}
      </div>
    </div>
  )
}