export type PersonalInfoLayout =
  | 'left'
  | 'left-right'
  | 'center-left'
  | 'center-right'
  | 'right-left'
  | 'right'

export interface ThemeConfig {
  typography: TypographyConfig
  spacing: SpacingConfig
  colors: ColorsConfig
  layout: LayoutConfig
  separators: SeparatorsConfig
}

export interface TextStyle {
  fontSize: string
  fontWeight: number
  lineHeight: string
  fontStyle?: 'italic' | 'normal'
  textTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none'
  letterSpacing?: string
}

export interface TypographyConfig {
  fontFamily: {
    heading: string
    body: string
  }
  header: {
    name: TextStyle
    label: TextStyle
    contact: TextStyle
  }
  section: {
    title: TextStyle
  }
  item: {
    header: TextStyle
    subheader: TextStyle
    body: TextStyle
  }
}

export interface SpacingConfig {
  document: {
    paddingX: string
    paddingY: string
  }
  section: {
    gap: string
  }
  item: {
    gap: string
  }
  line: {
    paragraph: string
  }
}

export interface ColorsConfig {
  background: string
  text: string
  primary: string
  secondary: string
  accent: string
  separator: string
}

export interface ItemLayoutConfig {
  standard: 'split' | 'stacked' | 'compact'
  tag: 'pills' | 'comma' | 'bullets' | 'grid'
  description: 'standard' | 'bordered' | 'compact'
  social: 'inline' | 'stacked' | 'grid'
}

export interface LayoutConfig {
  columns: {
    count: 1 | 2
    gap: string
  }
  header: {
    alignment: PersonalInfoLayout | 'center'
  }
  items?: ItemLayoutConfig
}

export interface SeparatorConfig {
  visible: boolean
  style: 'solid' | 'dashed'
  thickness: string
  color: string
}

export interface SeparatorsConfig {
  section: SeparatorConfig
}
