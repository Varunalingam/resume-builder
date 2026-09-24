import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SECTION_ICONS,
  getDefaultSectionIcon,
  getSectionIconName,
  getSectionIconUrl,
  getSocialDefaultIcon,
  getSocialIconUrl,
  POPULAR_ICONS8_ICONS,
} from './iconUtils.ts'

describe('iconUtils', () => {
  describe('getDefaultSectionIcon', () => {
    it('returns icon by section type match', () => {
      expect(getDefaultSectionIcon({ type: 'experience' })).toBe(
        DEFAULT_SECTION_ICONS.experience,
      )
      expect(getDefaultSectionIcon({ type: 'EDUCATION' })).toBe(
        DEFAULT_SECTION_ICONS.education,
      )
      expect(getDefaultSectionIcon({ type: 'skills' })).toBe(
        DEFAULT_SECTION_ICONS.skills,
      )
    })

    it('infers icon from section title if type is not in defaults', () => {
      expect(getDefaultSectionIcon({ title: 'Professional Summary' })).toBe(
        'resume',
      )
      expect(getDefaultSectionIcon({ title: 'My Work History' })).toBe(
        'briefcase',
      )
      expect(getDefaultSectionIcon({ title: 'Higher Degree & College' })).toBe(
        'graduation-cap',
      )
      expect(getDefaultSectionIcon({ title: 'Technical Skills' })).toBe('code')
      expect(getDefaultSectionIcon({ title: 'Notable Projects' })).toBe(
        'rocket',
      )
      expect(getDefaultSectionIcon({ title: 'Honors and Awards' })).toBe(
        'trophy',
      )
      expect(getDefaultSectionIcon({ title: 'Social Links & Handles' })).toBe(
        'contacts',
      )
      expect(getDefaultSectionIcon({ title: 'Foreign Languages' })).toBe(
        'language',
      )
    })

    it('falls back to bulleted-list if no type or title match', () => {
      expect(getDefaultSectionIcon({})).toBe('bulleted-list')
      expect(
        getDefaultSectionIcon({ type: 'custom', title: 'Random Notes' }),
      ).toBe('bulleted-list')
    })
  })

  describe('getSectionIconName', () => {
    it('returns custom icon if explicitly provided', () => {
      expect(
        getSectionIconName({
          type: 'experience',
          title: 'Work',
          icon: 'trophy',
        }),
      ).toBe('trophy')
    })

    it('trims whitespace on custom icon', () => {
      expect(
        getSectionIconName({
          icon: '  star  ',
        }),
      ).toBe('star')
    })

    it('falls back to default icon if icon is missing or empty', () => {
      expect(
        getSectionIconName({
          type: 'education',
          icon: '',
        }),
      ).toBe('graduation-cap')
    })
  })

  describe('getSectionIconUrl', () => {
    it('returns standard Icons8 48px color URL for slug', () => {
      const url = getSectionIconUrl({ icon: 'briefcase' })
      expect(url).toBe('https://img.icons8.com/color/48/briefcase.png')
    })

    it('returns custom URL directly if icon starts with http', () => {
      const customUrl = 'https://example.com/custom-icon.png'
      expect(getSectionIconUrl({ icon: customUrl })).toBe(customUrl)
    })
  })

  describe('getSocialDefaultIcon', () => {
    it('suggests known icon for common social networks and handles', () => {
      expect(getSocialDefaultIcon('LinkedIn')).toBe('linkedin')
      expect(getSocialDefaultIcon('https://github.com/user')).toBe('github')
      expect(getSocialDefaultIcon('twitter')).toBe('twitterx')
      expect(getSocialDefaultIcon('x.com/profile')).toBe('twitterx')
      expect(getSocialDefaultIcon('instagram')).toBe('instagram-new')
      expect(getSocialDefaultIcon('youtube')).toBe('youtube-play')
    })

    it('defaults to globe for unrecognized or empty inputs', () => {
      expect(getSocialDefaultIcon('')).toBe('globe')
      expect(getSocialDefaultIcon(undefined)).toBe('globe')
      expect(getSocialDefaultIcon('some-personal-domain.me')).toBe('globe')
    })
  })

  describe('getSocialIconUrl', () => {
    it('returns Icons8 URL for icon name slug', () => {
      expect(getSocialIconUrl('linkedin')).toBe(
        'https://img.icons8.com/color/48/linkedin.png',
      )
      expect(getSocialIconUrl('github')).toBe(
        'https://img.icons8.com/color/48/github.png',
      )
    })

    it('preserves full http/https URLs directly', () => {
      const url = 'https://example.com/my-icon.svg'
      expect(getSocialIconUrl(url)).toBe(url)
    })

    it('returns undefined if icon is empty or undefined', () => {
      expect(getSocialIconUrl('')).toBeUndefined()
      expect(getSocialIconUrl('   ')).toBeUndefined()
      expect(getSocialIconUrl(undefined)).toBeUndefined()
    })
  })

  describe('POPULAR_ICONS8_ICONS', () => {
    it('contains list of predefined icons with commonName and name', () => {
      expect(POPULAR_ICONS8_ICONS.length).toBeGreaterThan(10)
      expect(
        POPULAR_ICONS8_ICONS.some((icon) => icon.commonName === 'resume'),
      ).toBe(true)
      expect(
        POPULAR_ICONS8_ICONS.some((icon) => icon.commonName === 'linkedin'),
      ).toBe(true)
      expect(
        POPULAR_ICONS8_ICONS.some((icon) => icon.commonName === 'github'),
      ).toBe(true)
    })
  })
})
