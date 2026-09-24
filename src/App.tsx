import { useState } from 'react'
import Editor from './components/ui/Editor.tsx'
import ResumeEditor from './components/ui/ResumeEditor.tsx'
import ThemeEditor from './components/ui/ThemeEditor.tsx'
import ResumePreview from './components/ui/ResumePreview.tsx'
import ResizableSplitter from './components/features/ResizeableSplitter.tsx'
import Footer from './components/ui/Footer.tsx'
import { useIsMobile } from './hooks/useIsMobile.ts'
import { useDarkMode } from './hooks/useDarkMode.ts'

type MobileTab = 'resume' | 'theme' | 'preview'

function App() {
  const isMobile = useIsMobile()
  const [mobileTab, setMobileTab] = useState<MobileTab>('resume')
  const [isDark, toggleDarkMode] = useDarkMode()

  if (isMobile) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-gray-950">
        {/* Top Tab Bar for Mobile */}
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 py-2 shadow-2xs sm:px-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMobileTab('resume')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:py-2 sm:text-sm ${
                mobileTab === 'resume'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <img
                src="https://img.icons8.com/color/48/resume.png"
                alt=""
                className="pointer-events-none h-4 max-h-[16px] w-4 max-w-[16px] shrink-0 object-contain select-none sm:h-5 sm:max-h-[20px] sm:w-5 sm:max-w-[20px]"
              />
              <span>Edit Resume</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileTab('theme')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:py-2 sm:text-sm ${
                mobileTab === 'theme'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <img
                src="https://img.icons8.com/color/48/paint-palette.png"
                alt=""
                className="pointer-events-none h-4 max-h-[16px] w-4 max-w-[16px] shrink-0 object-contain select-none sm:h-5 sm:max-h-[20px] sm:w-5 sm:max-w-[20px]"
              />
              <span>Edit Theme</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3 sm:py-2 sm:text-sm ${
                mobileTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <img
                src="https://img.icons8.com/color/48/visible.png"
                alt=""
                className="pointer-events-none h-4 max-h-[16px] w-4 max-w-[16px] shrink-0 object-contain select-none sm:h-5 sm:max-h-[20px] sm:w-5 sm:max-w-[20px]"
              />
              <span>Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={toggleDarkMode}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white p-1.5 text-xs text-gray-700 shadow-2xs transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <img
                src={
                  isDark
                    ? 'https://img.icons8.com/color/48/sun--v1.png'
                    : 'https://img.icons8.com/color/48/moon.png'
                }
                alt=""
                className="pointer-events-none h-4 max-h-[16px] w-4 max-w-[16px] shrink-0 object-contain select-none"
              />
            </button>
          </div>
        </header>

        {/* Tab Content Area */}
        <main className="min-h-0 flex-1 overflow-hidden">
          {mobileTab === 'resume' && (
            <div className="h-full overflow-y-auto bg-gray-100 p-3 sm:p-4 dark:bg-gray-950">
              <ResumeEditor />
            </div>
          )}

          {mobileTab === 'theme' && (
            <div className="h-full overflow-y-auto bg-gray-100 p-3 sm:p-4 dark:bg-gray-950">
              <ThemeEditor />
            </div>
          )}

          {mobileTab === 'preview' && (
            <div className="preview-isolation h-full overflow-hidden [color-scheme:light]">
              <ResumePreview />
            </div>
          )}
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-gray-950">
      <div className="min-h-0 flex-1 overflow-hidden">
        <ResizableSplitter className="h-full w-full">
          <Editor />
          <div className="preview-isolation h-full w-full overflow-hidden [color-scheme:light]">
            <ResumePreview />
          </div>
        </ResizableSplitter>
      </div>
      <Footer />
    </div>
  )
}

export default App
