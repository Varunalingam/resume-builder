import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../../app/store.ts'
import { updatePersonalInfo } from '../../../../store/resume/resumeSlice.ts'
import type { PersonalInfoLink } from '../../../../types/resume.types.ts'
import {
  getSocialDefaultIcon,
  getSocialIconUrl,
} from '../../../../lib/iconUtils.ts'
import ImageCropModal from '../../../general/ImageCropModal.tsx'
import IconPickerModal from '../../../general/IconPickerModal.tsx'

const PersonalInfoEditor: React.FC = () => {
  const dispatch = useDispatch()
  const personalInfo = useSelector(
    (state: RootState) => state.resume.resume.personalInfo,
  )

  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [activeIconLinkIndex, setActiveIconLinkIndex] = useState<number | null>(
    null,
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(updatePersonalInfo({ [name]: value }))
  }

  const handlePhotoSave = (croppedDataUrl: string) => {
    dispatch(updatePersonalInfo({ photoUrl: croppedDataUrl }))
  }

  const handlePhotoRemove = () => {
    dispatch(updatePersonalInfo({ photoUrl: '' }))
  }

  // Social Links management
  const links: PersonalInfoLink[] = personalInfo.links || []

  const handleAddLink = () => {
    const newLink: PersonalInfoLink = {
      id: `link-${Date.now()}`,
      name: '',
      url: '',
      icon: '',
    }
    dispatch(updatePersonalInfo({ links: [...links, newLink] }))
  }

  const handleUpdateLink = (
    index: number,
    field: keyof PersonalInfoLink,
    value: string,
  ) => {
    const updated = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    )
    dispatch(updatePersonalInfo({ links: updated }))
  }

  const handleRemoveLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index)
    dispatch(updatePersonalInfo({ links: updated }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-gray-800">
        <img
          src="https://img.icons8.com/color/48/user.png"
          alt="Personal Info"
          className="pointer-events-none h-5 max-h-[20px] min-h-[20px] w-5 max-w-[20px] min-w-[20px] shrink-0 object-contain select-none"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Personal Information
        </h3>
      </div>

      {/* Passport Size Photo Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Passport Size Photo
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Indian passport standard ratio (35 × 45 mm)
            </p>
          </div>
          {personalInfo.photoUrl && (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Photo Uploaded
            </span>
          )}
        </div>

        <div className="mt-3.5 flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Passport Photo Frame (exact 35:45 ratio, 70px x 90px) */}
          <div className="relative shrink-0">
            {personalInfo.photoUrl ? (
              <div className="relative h-[90px] w-[70px] overflow-hidden rounded border-2 border-blue-500 bg-white shadow-xs dark:bg-gray-800">
                <img
                  src={personalInfo.photoUrl}
                  alt="Passport preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-[90px] w-[70px] flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-white p-1 text-center shadow-2xs dark:border-gray-700 dark:bg-gray-800">
                <span className="text-xl">👤</span>
                <span className="mt-1 text-[9px] font-medium text-gray-400">
                  35 × 45 mm
                </span>
              </div>
            )}
          </div>

          {/* Action buttons & description */}
          <div className="flex-1 space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {personalInfo.photoUrl
                ? 'Your passport photo is ready and will appear alongside your personal info in the resume header.'
                : 'Upload a portrait photo to include alongside your personal info. You can pan, zoom, and crop to the official 35 × 45 mm Indian passport frame.'}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCropModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
              >
                <span>📷</span>
                <span>
                  {personalInfo.photoUrl ? 'Change Photo' : 'Upload Photo'}
                </span>
              </button>

              {personalInfo.photoUrl && (
                <button
                  type="button"
                  onClick={handlePhotoRemove}
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-2xs transition-colors hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info Form Fields */}
      <div className="space-y-4 pt-1">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
            value={personalInfo.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
            value={personalInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
            value={personalInfo.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400"
            value={personalInfo.location}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Social Links & Profiles Section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5 dark:border-gray-800">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Social Links & Web Profiles
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Clickable in preview & print, with optional icons
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
          >
            + Add Link
          </button>
        </div>

        {links.length === 0 ? (
          <p className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
            No social links added to header yet. Click &quot;+ Add Link&quot;
            above.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {links.map((link, idx) => {
              const suggestedIcon = getSocialDefaultIcon(link.name || link.url)
              const iconUrl = getSocialIconUrl(link.icon)

              return (
                <div
                  key={link.id || idx}
                  className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-2xs dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`link-name-${link.id || idx}`}
                        className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        Platform / Label
                      </label>
                      <input
                        id={`link-name-${link.id || idx}`}
                        type="text"
                        value={link.name}
                        onChange={(e) =>
                          handleUpdateLink(idx, 'name', e.target.value)
                        }
                        placeholder="e.g. LinkedIn, GitHub, Portfolio"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`link-url-${link.id || idx}`}
                        className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                      >
                        URL / Link
                      </label>
                      <input
                        id={`link-url-${link.id || idx}`}
                        type="text"
                        value={link.url}
                        onChange={(e) =>
                          handleUpdateLink(idx, 'url', e.target.value)
                        }
                        placeholder="e.g. https://linkedin.com/in/username"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-xs shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2.5 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-gray-200 bg-gray-50 shadow-2xs dark:border-gray-700 dark:bg-gray-800">
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt=""
                            className="h-4 w-4 object-contain"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400">
                            None
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {link.icon ? (
                          <span className="rounded-sm border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/80 dark:text-blue-300">
                            {link.icon}
                          </span>
                        ) : (
                          'No icon'
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!link.icon && suggestedIcon && (
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateLink(idx, 'icon', suggestedIcon)
                          }
                          className="inline-flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 shadow-2xs transition-colors hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/60 dark:hover:text-blue-200"
                        >
                          <img
                            src={getSocialIconUrl(suggestedIcon)}
                            alt=""
                            className="h-3 w-3 object-contain"
                          />
                          <span>Suggest ({suggestedIcon})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveIconLinkIndex(idx)}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 shadow-2xs transition-colors hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
                      >
                        {link.icon ? 'Change Icon' : 'Choose Icon'}
                      </button>

                      {link.icon && (
                        <button
                          type="button"
                          onClick={() => handleUpdateLink(idx, 'icon', '')}
                          className="rounded border border-gray-200 bg-white px-1.5 py-1 text-[11px] font-medium text-red-600 shadow-2xs transition-colors hover:bg-red-50 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-950/40"
                        >
                          Clear
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="ml-2 text-xs text-red-600 hover:underline dark:text-red-400"
                      >
                        ✕ Remove Link
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handlePhotoSave}
        onRemove={handlePhotoRemove}
        currentPhotoUrl={personalInfo.photoUrl}
      />

      {activeIconLinkIndex !== null && (
        <IconPickerModal
          isOpen={true}
          onClose={() => setActiveIconLinkIndex(null)}
          onSelectIcon={(iconName) => {
            if (activeIconLinkIndex !== null) {
              handleUpdateLink(activeIconLinkIndex, 'icon', iconName)
            }
          }}
          currentIcon={links[activeIconLinkIndex]?.icon}
          title="Choose Social Icon"
          subtitle={`Select an icon for ${
            links[activeIconLinkIndex]?.name || 'link'
          }`}
        />
      )}
    </div>
  )
}

export default PersonalInfoEditor
