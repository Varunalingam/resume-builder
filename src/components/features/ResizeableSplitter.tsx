import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

interface ResizableSplitterProps {
  children: ReactNode
  direction?: 'horizontal' | 'vertical'
  initialSplit?: number
  minSize?: number
  maxSize?: number
  storageKey?: string
  className?: string
}

/**
 * ResizableSplitter
 *
 * A two-pane layout with a draggable divider. Works for horizontal
 * (side-by-side) or vertical (stacked) splits. Drag with mouse/touch,
 * or focus the handle and use arrow keys. Persists the split ratio to
 * localStorage if `storageKey` is provided.
 *
 * Usage:
 * <ResizableSplitter direction="horizontal" storageKey="editor-split">
 *   <FileTree />
 *   <Editor />
 * </ResizableSplitter>
 */
export default function ResizableSplitter({
  children,
  direction = 'horizontal',
  initialSplit = 50,
  minSize = 15,
  maxSize = 85,
  storageKey,
  className = '',
}: ResizableSplitterProps) {
  const [first, second] = Array.isArray(children) ? children : [children, null]
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const [split, setSplit] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) return Number(saved)
    }
    return initialSplit
  })

  const isHorizontal = direction === 'horizontal'

  const clamp = useCallback(
    (value: number) => Math.min(maxSize, Math.max(minSize, value)),
    [minSize, maxSize],
  )

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const raw = isHorizontal
        ? ((clientX - rect.left) / rect.width) * 100
        : ((clientY - rect.top) / rect.height) * 100
      setSplit(clamp(raw))
    },
    [isHorizontal, clamp],
  )

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return
      const point = 'touches' in e ? e.touches[0] : e
      updateFromPointer(point.clientX, point.clientY)
    },
    [updateFromPointer],
  )

  const stopDragging = useCallback(() => {
    draggingRef.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const startDragging = useCallback(() => {
    draggingRef.current = true
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize'
    document.body.style.userSelect = 'none'
  }, [isHorizontal])

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove as EventListener)
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('touchmove', handlePointerMove as EventListener, {
      passive: false,
    })
    window.addEventListener('touchend', stopDragging)
    return () => {
      window.removeEventListener(
        'mousemove',
        handlePointerMove as EventListener,
      )
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener(
        'touchmove',
        handlePointerMove as EventListener,
      )
      window.removeEventListener('touchend', stopDragging)
    }
  }, [handlePointerMove, stopDragging])

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, String(split))
  }, [split, storageKey])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    if (isHorizontal && e.key === 'ArrowLeft') setSplit((s) => clamp(s - step))
    if (isHorizontal && e.key === 'ArrowRight') setSplit((s) => clamp(s + step))
    if (!isHorizontal && e.key === 'ArrowUp') setSplit((s) => clamp(s - step))
    if (!isHorizontal && e.key === 'ArrowDown') setSplit((s) => clamp(s + step))
    if (e.key === 'Home') setSplit(minSize)
    if (e.key === 'End') setSplit(maxSize)
  }

  return (
    <div
      ref={containerRef}
      className={`flex h-full w-full ${
        isHorizontal ? 'flex-row' : 'flex-col'
      } ${className}`}
    >
      <div
        className="h-full min-h-0 overflow-x-auto overflow-y-auto"
        style={{ flexBasis: `${split}%` }}
      >
        {first}
      </div>

      <div
        role="separator"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(split)}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        tabIndex={0}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        onKeyDown={handleKeyDown}
        className={`group relative flex shrink-0 items-center justify-center bg-gray-200 transition-colors hover:bg-blue-400 focus-visible:bg-blue-500 focus-visible:outline-none dark:bg-gray-700 dark:hover:bg-blue-500 ${
          isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'
        } `}
      >
        {/* wider invisible hit-area so the handle is easy to grab */}
        <div
          className={`absolute ${
            isHorizontal ? '-inset-x-1.5 inset-y-0' : 'inset-x-0 -inset-y-1.5'
          }`}
        />
        <div
          className={`rounded-full bg-gray-400 group-hover:bg-white group-focus-visible:bg-white dark:bg-gray-500 ${
            isHorizontal ? 'h-8 w-[3px]' : 'h-[3px] w-8'
          } `}
        />
      </div>

      <div
        className="h-full min-h-0 overflow-x-auto overflow-y-auto"
        style={{ flexBasis: `${100 - split}%` }}
      >
        {second}
      </div>
    </div>
  )
}
