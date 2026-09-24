import { useState } from 'react'
import ResumeEditor from './ResumeEditor.tsx'
import ThemeEditor from './ThemeEditor.tsx'
import { useDarkMode } from '../../hooks/useDarkMode.ts'

type EditorTab = 'resume' | 'theme'

const Editor = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>('resume')
  const [isDark, toggleDarkMode] = useDarkMode()

  return (
    <div className="box-border min-h-full bg-gray-100 px-4 pb-4 transition-colors duration-200 dark:bg-gray-950">
      <div className="sticky top-0 z-20 -mx-4 mb-4 flex items-center justify-between border-b border-gray-200/80 bg-gray-100/95 px-4 py-3 shadow-2xs backdrop-blur-xs transition-colors dark:border-gray-800/80 dark:bg-gray-950/95">
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium shadow-xs transition-all ${
              activeTab === 'resume'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('resume')}
          >
            <img
              src="https://img.icons8.com/color/48/resume.png"
              alt=""
              className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
            />
            <span>Edit Resume</span>
          </button>
          <button
            className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium shadow-xs transition-all ${
              activeTab === 'theme'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('theme')}
          >
            <img
              src="https://img.icons8.com/color/48/paint-palette.png"
              alt=""
              className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
            />
            <span>Edit Theme</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:scale-105 hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <img
              src={
                isDark
                  ? 'https://img.icons8.com/color/48/sun--v1.png'
                  : 'https://img.icons8.com/color/48/moon.png'
              }
              alt={isDark ? 'Light Mode' : 'Dark Mode'}
              className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
            />
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
      {activeTab === 'resume' ? <ResumeEditor /> : <ThemeEditor />}
    </div>
  )
}

export default Editor
