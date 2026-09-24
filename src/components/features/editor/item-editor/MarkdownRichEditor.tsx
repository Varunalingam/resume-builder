import React, { useEffect, useRef, useState } from 'react'
import {
  htmlToMarkdown,
  markdownToHtml,
} from '../../../../lib/markdownUtils.ts'

export interface MarkdownRichEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  rows?: number
}

const MarkdownRichEditor: React.FC<MarkdownRichEditorProps> = ({
  id,
  value,
  onChange,
  label = 'Description',
  placeholder = 'Key accomplishments, responsibilities, or notes...',
  rows = 4,
}) => {
  const [mode, setMode] = useState<'markdown' | 'richtext'>('markdown')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const richTextRef = useRef<HTMLDivElement>(null)

  // Keep rich text innerHTML in sync when switching to richtext or when value changes externally
  useEffect(() => {
    if (mode === 'richtext' && richTextRef.current) {
      const currentHtml = richTextRef.current.innerHTML
      const expectedHtml = markdownToHtml(value)
      // Only update if genuinely different to avoid cursor jumps while typing
      if (
        currentHtml !== expectedHtml &&
        htmlToMarkdown(currentHtml) !== value
      ) {
        richTextRef.current.innerHTML = expectedHtml
      }
    }
  }, [mode, value])

  const handleModeSwitch = (newMode: 'markdown' | 'richtext') => {
    if (newMode === mode) return

    if (newMode === 'richtext') {
      // Markdown -> Rich Text
      setMode('richtext')
      // InnerHTML will be synced in useEffect
    } else {
      // Rich Text -> Markdown
      if (richTextRef.current) {
        const md = htmlToMarkdown(richTextRef.current.innerHTML)
        onChange(md)
      }
      setMode('markdown')
    }
  }

  // --- Markdown Formatting Helpers ---
  const applyMarkdownFormat = (
    prefix: string,
    suffix: string,
    defaultPlaceholder = 'text',
  ) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const replacement = selected
      ? `${prefix}${selected}${suffix}`
      : `${prefix}${defaultPlaceholder}${suffix}`

    const nextVal =
      value.substring(0, start) + replacement + value.substring(end)
    onChange(nextVal)

    requestAnimationFrame(() => {
      textarea.focus()
      if (selected) {
        textarea.setSelectionRange(start + prefix.length, end + prefix.length)
      } else {
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + defaultPlaceholder.length,
        )
      }
    })
  }

  const applyMarkdownBullet = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)

    let replacement: string
    if (selected) {
      replacement = selected
        .split('\n')
        .map((line) =>
          line.startsWith('- ') ? line.substring(2) : `- ${line}`,
        )
        .join('\n')
    } else {
      replacement = '- List item'
    }

    const nextVal =
      value.substring(0, start) + replacement + value.substring(end)
    onChange(nextVal)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(start, start + replacement.length)
    })
  }

  // --- Rich Text Formatting Helpers ---
  const executeRichCommand = (command: string, arg?: string) => {
    if (typeof document === 'undefined') return
    richTextRef.current?.focus()
    document.execCommand(command, false, arg)
    if (richTextRef.current) {
      const nextMd = htmlToMarkdown(richTextRef.current.innerHTML)
      onChange(nextMd)
    }
  }

  const handleRichTextInput = () => {
    if (!richTextRef.current) return
    const nextMd = htmlToMarkdown(richTextRef.current.innerHTML)
    onChange(nextMd)
  }

  // --- Unified Format Actions ---
  const handleBold = () => {
    if (mode === 'markdown') {
      applyMarkdownFormat('**', '**', 'bold text')
    } else {
      executeRichCommand('bold')
    }
  }

  const handleItalic = () => {
    if (mode === 'markdown') {
      applyMarkdownFormat('*', '*', 'italic text')
    } else {
      executeRichCommand('italic')
    }
  }

  const handleUnderline = () => {
    if (mode === 'markdown') {
      applyMarkdownFormat('<u>', '</u>', 'underlined text')
    } else {
      executeRichCommand('underline')
    }
  }

  const handleSubscript = () => {
    if (mode === 'markdown') {
      applyMarkdownFormat('<sub>', '</sub>', 'subscript')
    } else {
      executeRichCommand('subscript')
    }
  }

  const handleSuperscript = () => {
    if (mode === 'markdown') {
      applyMarkdownFormat('<sup>', '</sup>', 'superscript')
    } else {
      executeRichCommand('superscript')
    }
  }

  const handleBulletList = () => {
    if (mode === 'markdown') {
      applyMarkdownBullet()
    } else {
      executeRichCommand('insertUnorderedList')
    }
  }

  // Markdown textarea keyboard shortcuts
  const handleMarkdownKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault()
        handleBold()
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        handleItalic()
      } else if (e.key === 'u' || e.key === 'U') {
        e.preventDefault()
        handleUnderline()
      }
    }
  }

  return (
    <div className="w-full">
      {/* Top Label & Mode Segmented Switcher */}
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
        <div className="flex items-center rounded-lg border border-gray-200 bg-gray-100 p-0.5 text-xs dark:border-gray-700 dark:bg-gray-800">
          <button
            type="button"
            onClick={() => handleModeSwitch('markdown')}
            aria-pressed={mode === 'markdown'}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-all ${
              mode === 'markdown'
                ? 'bg-white text-blue-600 shadow-2xs dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Markdown
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('richtext')}
            aria-pressed={mode === 'richtext'}
            className={`cursor-pointer rounded-md px-2.5 py-1 font-medium transition-all ${
              mode === 'richtext'
                ? 'bg-white text-blue-600 shadow-2xs dark:bg-gray-700 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Rich Text
          </button>
        </div>
      </div>

      {/* Editor Box Container with Toolbar */}
      <div className="markdown-rich-editor overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/90 px-2.5 py-1.5 dark:border-gray-700 dark:bg-gray-800/90">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleBold}
            title="Bold (Ctrl+B / **bold**)"
            aria-label="Format bold"
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs font-bold text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            B
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleItalic}
            title="Italic (Ctrl+I / *italic*)"
            aria-label="Format italic"
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded font-serif text-xs text-gray-700 italic transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            I
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleUnderline}
            title="Underline (Ctrl+U / <u>text</u>)"
            aria-label="Format underline"
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs font-semibold text-gray-700 underline transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            U
          </button>

          <div className="mx-1 h-4 w-[1px] bg-gray-300 dark:bg-gray-600" />

          {/* Subscript */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSubscript}
            title="Subscript (<sub>text</sub>)"
            aria-label="Format subscript"
            className="inline-flex h-7 cursor-pointer items-center justify-center rounded px-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span>X</span>
            <span className="align-sub text-[10px]">₂</span>
          </button>

          {/* Superscript */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSuperscript}
            title="Superscript (<sup>text</sup>)"
            aria-label="Format superscript"
            className="inline-flex h-7 cursor-pointer items-center justify-center rounded px-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span>X</span>
            <span className="align-super text-[10px]">²</span>
          </button>

          <div className="mx-1 h-4 w-[1px] bg-gray-300 dark:bg-gray-600" />

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleBulletList}
            title="Bullet list (- item)"
            aria-label="Format bullet list"
            className="inline-flex h-7 cursor-pointer items-center justify-center gap-1 rounded px-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span className="text-sm leading-none">•</span>
            <span>List</span>
          </button>

          {/* Active Mode Indicator */}
          <div className="ml-auto flex items-center gap-1.5 pr-1 text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                mode === 'markdown'
                  ? 'bg-blue-500 dark:bg-blue-400'
                  : 'bg-emerald-500 dark:bg-emerald-400'
              }`}
            />
            <span>{mode === 'markdown' ? 'Markdown Mode' : 'Rich Text (WYSIWYG)'}</span>
          </div>
        </div>

        {/* Editor Body */}
        {mode === 'markdown' ? (
          <textarea
            ref={textareaRef}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleMarkdownKeyDown}
            placeholder={placeholder}
            rows={rows}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            className="block w-full resize-y bg-transparent px-3.5 py-2.5 font-mono text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        ) : (
          <div
            ref={richTextRef}
            id={id}
            contentEditable
            suppressContentEditableWarning
            onInput={handleRichTextInput}
            data-placeholder={placeholder}
            style={{
              minHeight: `${Math.max(rows * 26, 96)}px`,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
            }}
            className="markdown-rich-content block w-full resize-y bg-transparent px-3.5 py-2.5 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        )}
      </div>

      {/* Quick Helper Notes */}
      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px] text-gray-500 dark:text-gray-400">
        {mode === 'markdown' ? (
          <span className="flex flex-wrap items-center gap-1">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Syntax:</span>{' '}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">**bold**</code>
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">*italic*</code>
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">&lt;u&gt;underline&lt;/u&gt;</code>
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">&lt;sub&gt;sub&lt;/sub&gt;</code>
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">&lt;sup&gt;sup&lt;/sup&gt;</code>
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">- bullet</code>
          </span>
        ) : (
          <span>
            <strong className="font-semibold text-gray-600 dark:text-gray-300">WYSIWYG:</strong> Formatting toolbar &amp; shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) enabled. Auto-syncs to markdown.
          </span>
        )}
      </div>
    </div>
  )
}

export default MarkdownRichEditor
