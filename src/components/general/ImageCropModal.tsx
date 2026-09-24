import React, { useEffect, useRef, useState } from 'react'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (croppedDataUrl: string) => void
  onRemove?: () => void
  currentPhotoUrl?: string
}

// Indian Passport Photo standard ratio is 35mm (W) x 45mm (H) -> 7:9
const FRAME_WIDTH = 280
const FRAME_HEIGHT = 360 // 280 * (45 / 35) = 360
const OUTPUT_WIDTH = 350
const OUTPUT_HEIGHT = 450

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onRemove,
  currentPhotoUrl,
}) => {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string>(
    () => currentPhotoUrl || '',
  )
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    {
      width: 0,
      height: 0,
    },
  )
  const [zoom, setZoom] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number>(0)
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true)

  const isDraggingRef = useRef<boolean>(false)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageElementRef = useRef<HTMLImageElement | null>(null)

  // Initialize or reset state when modal opens or current photo changes
  useEffect(() => {
    if (isOpen) {
      setSelectedImageSrc(currentPhotoUrl || '')
      setZoom(1)
      setPan({ x: 0, y: 0 })
      setRotation(0)
    }
  }, [isOpen, currentPhotoUrl])

  // Load natural dimensions when selected image changes
  useEffect(() => {
    if (!selectedImageSrc) {
      setImageSize({ width: 0, height: 0 })
      imageElementRef.current = null
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight })
      imageElementRef.current = img
      setPan({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
    }
    img.src = selectedImageSrc
  }, [selectedImageSrc])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImageSrc(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedImageSrc) return
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    })
  }

  const handleMouseUp = () => {
    isDraggingRef.current = false
  }

  // Touch handlers for mobile/tablet devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!selectedImageSrc || e.touches.length !== 1) return
    isDraggingRef.current = true
    const touch = e.touches[0]
    dragStartRef.current = {
      x: touch.clientX - pan.x,
      y: touch.clientY - pan.y,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return
    const touch = e.touches[0]
    setPan({
      x: touch.clientX - dragStartRef.current.x,
      y: touch.clientY - dragStartRef.current.y,
    })
  }

  const handleTouchEnd = () => {
    isDraggingRef.current = false
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.08 : -0.08
    setZoom((prev) =>
      Math.min(3, Math.max(0.8, Math.round((prev + delta) * 100) / 100)),
    )
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleRecenter = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  const handleCropAndSave = () => {
    if (
      !imageElementRef.current ||
      imageSize.width === 0 ||
      imageSize.height === 0
    ) {
      if (selectedImageSrc) {
        onSave(selectedImageSrc)
        onClose()
      }
      return
    }

    try {
      const canvas = document.createElement('canvas')
      canvas.width = OUTPUT_WIDTH
      canvas.height = OUTPUT_HEIGHT
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        onSave(selectedImageSrc)
        onClose()
        return
      }

      // Base display scale to cover the frame (280x360)
      const scaleX = FRAME_WIDTH / imageSize.width
      const scaleY = FRAME_HEIGHT / imageSize.height
      const baseScale = Math.max(scaleX, scaleY)

      // Multiplier from screen frame (280x360) to canvas output (350x450)
      const outputMultiplier = OUTPUT_WIDTH / FRAME_WIDTH // 1.25

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT)

      // Translate to center of output canvas
      ctx.translate(OUTPUT_WIDTH / 2, OUTPUT_HEIGHT / 2)

      // Apply pan scaled up to canvas size
      ctx.translate(pan.x * outputMultiplier, pan.y * outputMultiplier)

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180)

      // Apply scale
      const totalScale = baseScale * zoom * outputMultiplier
      ctx.scale(totalScale, totalScale)

      // Draw image centered
      ctx.drawImage(
        imageElementRef.current,
        -imageSize.width / 2,
        -imageSize.height / 2,
        imageSize.width,
        imageSize.height,
      )

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.92)
      onSave(croppedUrl)
      onClose()
    } catch {
      // Fallback in case of CORS or canvas security error
      onSave(selectedImageSrc)
      onClose()
    }
  }

  // Base cover scale calculation for preview rendering
  const scaleX = imageSize.width > 0 ? FRAME_WIDTH / imageSize.width : 1
  const scaleY = imageSize.height > 0 ? FRAME_HEIGHT / imageSize.height : 1
  const baseScale = Math.max(scaleX, scaleY)
  const renderedWidth =
    imageSize.width > 0 ? imageSize.width * baseScale : FRAME_WIDTH
  const renderedHeight =
    imageSize.height > 0 ? imageSize.height * baseScale : FRAME_HEIGHT

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Passport Photo Crop Modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none dark:bg-black/75"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl transition-colors dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              📷
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Passport Size Photo (35 × 45 mm)
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Official Indian Passport Frame (7:9 ratio, 70–80% face coverage)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 flex-col items-center overflow-y-auto px-5 py-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!selectedImageSrc ? (
            /* Upload Empty State */
            <div className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800/40">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl dark:border dark:border-blue-800/50 dark:bg-blue-950/80 dark:text-blue-300">
                🖼️
              </div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Select Your Passport Photo
              </h4>
              <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
                Upload a portrait image. You can pan, zoom, and rotate to fit
                the official Indian passport frame.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
              >
                Choose Photo from Device
              </button>
            </div>
          ) : (
            /* Cropper Area */
            <div className="flex w-full flex-col items-center">
              {/* Indian Passport Crop Frame with elevation & dark mode support */}
              <div
                style={{
                  width: `${FRAME_WIDTH}px`,
                  height: `${FRAME_HEIGHT}px`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
                className="relative cursor-grab overflow-hidden rounded-md border-2 border-blue-500 bg-gray-950 shadow-md ring-2 ring-blue-500/20 active:cursor-grabbing dark:border-blue-400 dark:ring-blue-400/30"
              >
                {/* Image */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                  }}
                >
                  <img
                    src={selectedImageSrc}
                    alt="Passport Crop"
                    style={{
                      width: `${renderedWidth}px`,
                      height: `${renderedHeight}px`,
                      maxWidth: 'none',
                      maxHeight: 'none',
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                    }}
                    className="select-none"
                    draggable={false}
                  />
                </div>

                {/* Indian Passport Framing Guides */}
                {showGuidelines && (
                  <div className="pointer-events-none absolute inset-0">
                    {/* Passport Head Oval Guideline (70-80% height) */}
                    <svg
                      className="h-full w-full opacity-70"
                      viewBox="0 0 280 360"
                      style={{
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                      }}
                    >
                      {/* 3x3 Rule of Thirds Grid */}
                      <line
                        x1="93.3"
                        y1="0"
                        x2="93.3"
                        y2="360"
                        stroke="#ffffff"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="186.6"
                        y1="0"
                        x2="186.6"
                        y2="360"
                        stroke="#ffffff"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="120"
                        x2="280"
                        y2="120"
                        stroke="#ffffff"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1="0"
                        y1="240"
                        x2="280"
                        y2="240"
                        stroke="#ffffff"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                      />

                      {/* Head Oval & Chin Line */}
                      <ellipse
                        cx="140"
                        cy="170"
                        rx="75"
                        ry="105"
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      {/* Eye Line */}
                      <line
                        x1="100"
                        y1="150"
                        x2="180"
                        y2="150"
                        stroke="#60a5fa"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      {/* Chin Line */}
                      <line
                        x1="115"
                        y1="275"
                        x2="165"
                        y2="275"
                        stroke="#60a5fa"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    </svg>

                    <div className="absolute top-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold text-blue-300 shadow-xs backdrop-blur-xs">
                      35 × 45 mm Frame
                    </div>
                  </div>
                )}
              </div>

              {/* Pan & Drag Instruction */}
              <div className="mt-2.5 text-center text-[11px] text-gray-500 dark:text-gray-400">
                Drag to position face within the oval guideline • Use slider to
                zoom
              </div>

              {/* Adjustments Controls with proper dark mode background and hover states */}
              <div className="mt-3 flex w-full flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors dark:border-gray-700/80 dark:bg-gray-800/80">
                {/* Zoom Control */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Zoom:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((prev) =>
                        Math.max(0.8, Math.round((prev - 0.1) * 10) / 10),
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    title="Zoom Out"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min="0.8"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="h-1.5 flex-1 cursor-pointer rounded-lg bg-gray-200 accent-blue-600 dark:bg-gray-700 dark:accent-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((prev) =>
                        Math.min(3, Math.round((prev + 0.1) * 10) / 10),
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                    title="Zoom In"
                  >
                    +
                  </button>
                  <span className="w-12 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Secondary Actions (Rotate, Recenter, Guidelines, Change Photo) */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-gray-200 pt-1.5 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleRotate}
                      className="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      title="Rotate 90 degrees"
                    >
                      <span>🔄</span>
                      <span>Rotate</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRecenter}
                      className="rounded border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      title="Reset Position"
                    >
                      Re-center
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGuidelines(!showGuidelines)}
                      className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        showGuidelines
                          ? 'border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950/80 dark:text-blue-300 dark:hover:bg-blue-900/80'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white'
                      }`}
                      title="Toggle Face Oval Guideline"
                    >
                      Guides {showGuidelines ? '✓' : ''}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-blue-600 transition-colors hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-950">
          <div>
            {currentPhotoUrl && onRemove && (
              <button
                type="button"
                onClick={() => {
                  onRemove()
                  onClose()
                }}
                className="text-xs font-semibold text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove Photo
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropAndSave}
              disabled={!selectedImageSrc}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              Apply & Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
