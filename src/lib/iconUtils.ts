export const DEFAULT_SECTION_ICONS: Record<string, string> = {
  text: 'resume',
  experience: 'briefcase',
  education: 'graduation-cap',
  skills: 'code',
  projects: 'rocket',
}

export const COMMON_SOCIAL_ICONS: Record<string, string> = {
  linkedin: 'linkedin',
  github: 'github',
  twitter: 'twitterx',
  twitterx: 'twitterx',
  x: 'twitterx',
  portfolio: 'globe',
  website: 'globe',
  web: 'globe',
  blog: 'globe',
  instagram: 'instagram-new',
  facebook: 'facebook-new',
  youtube: 'youtube-play',
  discord: 'discord-logo',
  telegram: 'telegram-app',
  medium: 'medium-monogram',
  stackoverflow: 'stack-overflow',
  'stack-overflow': 'stack-overflow',
  reddit: 'reddit',
  gitlab: 'gitlab',
  behance: 'behance',
  dribbble: 'dribbble',
  email: 'mail',
  mail: 'mail',
  phone: 'phone',
}

export const POPULAR_ICONS8_ICONS = [
  // Common Sections
  {commonName: 'resume', name: 'Resume / Summary'},
  {commonName: 'document', name: 'Document'},
  {commonName: 'briefcase', name: 'Work / Experience'},
  {commonName: 'graduation-cap', name: 'Graduation / Education'},
  {commonName: 'school', name: 'School'},
  {commonName: 'diploma', name: 'Diploma'},
  {commonName: 'code', name: 'Code / Tech'},
  {commonName: 'star', name: 'Star / Highlights'},
  {commonName: 'bulleted-list', name: 'List'},
  {commonName: 'rocket', name: 'Rocket / Launch'},
  {commonName: 'idea', name: 'Idea / Innovation'},
  {commonName: 'trophy', name: 'Trophy / Awards'},
  {commonName: 'badge', name: 'Badge / Honors'},
  {commonName: 'certificate', name: 'Certificate'},
  {commonName: 'contacts', name: 'Contacts / Social'},
  {commonName: 'user', name: 'User / Profile'},
  {commonName: 'brain', name: 'Brain / Knowledge'},
  {commonName: 'language', name: 'Language'},
  {commonName: 'wrench', name: 'Wrench / Skills'},
  {commonName: 'folder-invoices', name: 'Folder / Projects'},
  {commonName: 'book', name: 'Book / Publications'},
  {commonName: 'settings', name: 'Settings'},
  {commonName: 'plus--v1', name: 'Plus / Add'},

  // Social Media & Web Profiles
  {commonName: 'linkedin', name: 'LinkedIn'},
  {commonName: 'github', name: 'GitHub'},
  {commonName: 'twitterx', name: 'Twitter / X'},
  {commonName: 'globe', name: 'Website / Portfolio'},
  {commonName: 'mail', name: 'Email'},
  {commonName: 'phone', name: 'Phone'},
  {commonName: 'instagram-new', name: 'Instagram'},
  {commonName: 'youtube-play', name: 'YouTube'},
  {commonName: 'discord-logo', name: 'Discord'},
  {commonName: 'telegram-app', name: 'Telegram'},
  {commonName: 'medium-monogram', name: 'Medium'},
  {commonName: 'stack-overflow', name: 'Stack Overflow'},
  {commonName: 'gitlab', name: 'GitLab'},
  {commonName: 'behance', name: 'Behance'},
  {commonName: 'dribbble', name: 'Dribbble'},
  {commonName: 'reddit', name: 'Reddit'},
]

export function getDefaultSectionIcon(section: {
  type?: string
  title?: string
}): string {
  const typeKey = section.type?.toLowerCase() || ''
  if (DEFAULT_SECTION_ICONS[typeKey]) {
    return DEFAULT_SECTION_ICONS[typeKey]
  }

  const title = section.title?.toLowerCase() || ''
  if (
    title.includes('summary') ||
    title.includes('about') ||
    title.includes('profile')
  ) {
    return 'resume'
  }
  if (
    title.includes('exp') ||
    title.includes('work') ||
    title.includes('employment') ||
    title.includes('job')
  ) {
    return 'briefcase'
  }
  if (
    title.includes('edu') ||
    title.includes('school') ||
    title.includes('college') ||
    title.includes('degree') ||
    title.includes('university')
  ) {
    return 'graduation-cap'
  }
  if (title.includes('skill') || title.includes('tech')) {
    return 'code'
  }
  if (title.includes('project')) {
    return 'rocket'
  }
  if (title.includes('certif') || title.includes('license')) {
    return 'certificate'
  }
  if (title.includes('award') || title.includes('honor')) {
    return 'trophy'
  }
  if (title.includes('contact') || title.includes('social')) {
    return 'contacts'
  }
  if (title.includes('lang')) {
    return 'language'
  }

  return 'bulleted-list'
}

export function getSectionIconName(section: {
  type?: string
  title?: string
  icon?: string
}): string {
  return section.icon?.trim() || getDefaultSectionIcon(section)
}

export function getSectionIconUrl(section: {
  type?: string
  title?: string
  icon?: string
}): string {
  const icon = getSectionIconName(section)
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return icon
  }
  return `https://img.icons8.com/color/48/${icon}.png`
}

/**
 * Returns suggested icon slug for a social media platform name or URL.
 */
export function getSocialDefaultIcon(platformOrUrl?: string): string {
  if (!platformOrUrl) return 'globe'
  const text = platformOrUrl.toLowerCase().trim()
  for (const [key, iconName] of Object.entries(COMMON_SOCIAL_ICONS)) {
    if (text.includes(key)) {
      return iconName
    }
  }
  return 'globe'
}

/**
 * Returns full URL for an icon slug or returns the direct image URL if already absolute.
 */
export function getSocialIconUrl(iconNameOrUrl?: string): string | undefined {
  if (!iconNameOrUrl || !iconNameOrUrl.trim()) return undefined
  const icon = iconNameOrUrl.trim()
  if (icon.startsWith('http://') || icon.startsWith('https://')) {
    return icon
  }
  return `https://img.icons8.com/color/48/${icon}.png`
}
