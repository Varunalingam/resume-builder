import React from 'react'

const AntigravityIcon: React.FC<{ className?: string }> = ({
  className = 'h-4 w-4',
}) => (
  <span
    className={`inline-flex shrink-0 items-center justify-center transition-transform hover:scale-110 ${className}`}
    title="Google Antigravity"
  >
    <img
      src={`${import.meta.env.BASE_URL}antigravity-icon-dark.png`}
      alt="Google Antigravity"
      className="h-full w-full object-contain select-none dark:hidden"
    />
    <img
      src={`${import.meta.env.BASE_URL}antigravity-icon-white.png`}
      alt="Google Antigravity"
      className="hidden h-full w-full object-contain select-none dark:inline-block"
    />
  </span>
)

const Footer: React.FC = () => {
  return (
    <footer className="sticky bottom-0 z-20 flex shrink-0 items-center justify-between border-t border-gray-200 bg-white/95 px-4 py-2 text-xs font-medium text-gray-600 shadow-2xs backdrop-blur-xs dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-400">
      {/* Left side: Developed with love by VSSVe */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-600 dark:text-gray-400">Developed with</span>
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 shrink-0 transition-transform select-none hover:scale-125"
          aria-label="love"
          role="img"
        >
          <defs>
            <linearGradient
              id="brightRedHeart"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF3366" />
              <stop offset="100%" stopColor="#FF0033" />
            </linearGradient>
          </defs>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#brightRedHeart)"
          />
        </svg>
        <span className="text-gray-600 dark:text-gray-400">by</span>
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          VSSVe
        </span>
        <img
          src={`${import.meta.env.BASE_URL}vssve-logo.svg`}
          alt="VSSVe Logo"
          title="VSSVe Studios"
          className="h-5 w-5 shrink-0 rounded object-contain shadow-2xs transition-transform select-none hover:scale-110"
        />
      </div>

      {/* Right side: Made with Google Antigravity Gemini 3.8 Flash */}
      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
        {/* Laptop / Desktop View */}
        <div className="hidden items-center gap-1.5 md:flex">
          <span>Made with</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Google Antigravity
          </span>
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Gemini 3.8 Flash
          </span>
          <AntigravityIcon className="h-4.5 w-4.5" />
        </div>

        {/* Mobile View */}
        <div className="flex items-center gap-1.5 md:hidden">
          <AntigravityIcon className="h-4 w-4" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Gemini 3.8 Flash
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
