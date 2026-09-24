export const SectionTypes = {
  TEXT: 'text',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  PROJECTS: 'projects',
  SKILLS: 'skills',
} as const
export type SectionType = (typeof SectionTypes)[keyof typeof SectionTypes]

export const SectionItemTypes = {
  STANDARD: 'standard',
  TAG: 'tag',
  DESCRIPTION: 'description',
  SOCIAL: 'social',
} as const
export type SectionItemType =
  (typeof SectionItemTypes)[keyof typeof SectionItemTypes]

export interface DateRange {
  startDate: string
  endDate?: string
}

export interface StandardEntry {
  id: string
  type: typeof SectionItemTypes.STANDARD
  header: string
  subHeader: string
  dateRange?: DateRange
  location?: string
  description: string
  isVisible?: boolean
}

export interface TagEntry {
  id: string
  type: typeof SectionItemTypes.TAG
  header?: string
  tags: string[]
  isVisible?: boolean
}

export interface DescriptionEntry {
  id: string
  type: typeof SectionItemTypes.DESCRIPTION
  subHeader?: string
  description: string
  isVisible?: boolean
}

export interface SocialEntry {
  id: string
  type: typeof SectionItemTypes.SOCIAL
  platform: string
  url: string
  icon?: string
  isVisible?: boolean
}

export type SectionItem =
  | StandardEntry
  | TagEntry
  | DescriptionEntry
  | SocialEntry

export interface Section<T extends SectionItem = SectionItem> {
  id: string
  title: string
  type: SectionType
  itemType?: SectionItemType
  items: T[]
  isVisible?: boolean
  icon?: string
}

export type { PersonalInfoLayout } from './theme.types.ts'

export interface PersonalInfoLink {
  id: string
  name: string
  url: string
  icon?: string
}

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  photoUrl?: string
  layout?: import('./theme.types.ts').PersonalInfoLayout
  links?: PersonalInfoLink[]
}

export interface Resume {
  personalInfo: PersonalInfo
  sections: Section[]
}
