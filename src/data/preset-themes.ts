import type { ThemeConfig } from '../types/theme.types.ts'

export type PresetTheme = ThemeConfig & {
  id: string
  name: string
}

export const presetThemes: PresetTheme[] = [
  // 1. Modern Minimal (Default)
  {
    id: 'default',
    name: 'Modern Minimal',
    typography: {
      fontFamily: {
        heading: 'Calibri, sans-serif',
        body: 'Calibri, sans-serif',
      },
      header: {
        name: { fontSize: '28pt', fontWeight: 700, lineHeight: '1.2' },
        label: { fontSize: '12pt', fontWeight: 400, lineHeight: '1.4' },
        contact: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '14pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '11pt', fontWeight: 400, lineHeight: '1.4' },
        body: { fontSize: '11pt', fontWeight: 400, lineHeight: '1.4' },
      },
    },
    spacing: {
      document: { paddingX: '48pt', paddingY: '24pt' },
      section: { gap: '16pt' },
      item: { gap: '8pt' },
      line: { paragraph: '0.5rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#000000',
      secondary: '#555555',
      accent: '#000000',
      separator: '#CCCCCC',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'split',
        tag: 'pills',
        description: 'standard',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1pt',
        color: '#CCCCCC',
      },
    },
  },

  // 2. Classic Executive
  {
    id: 'classic-executive',
    name: 'Classic Executive',
    typography: {
      fontFamily: {
        heading: '"Times New Roman", Times, Georgia, serif',
        body: '"Times New Roman", Times, Georgia, serif',
      },
      header: {
        name: { fontSize: '26pt', fontWeight: 700, lineHeight: '1.2' },
        label: { fontSize: '12pt', fontWeight: 400, lineHeight: '1.4' },
        contact: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '13pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '10.5pt', fontWeight: 600, lineHeight: '1.4' },
        body: { fontSize: '10.5pt', fontWeight: 400, lineHeight: '1.5' },
      },
    },
    spacing: {
      document: { paddingX: '44pt', paddingY: '24pt' },
      section: { gap: '16pt' },
      item: { gap: '9pt' },
      line: { paragraph: '0.45rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#0F172A',
      primary: '#0F172A',
      secondary: '#1E40AF',
      accent: '#1D4ED8',
      separator: '#0F172A',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'center' },
      items: {
        standard: 'split',
        tag: 'comma',
        description: 'standard',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1.5pt',
        color: '#0F172A',
      },
    },
  },

  // 3. Tech & Modern
  {
    id: 'tech-modern',
    name: 'Tech & Modern',
    typography: {
      fontFamily: {
        heading:
          '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      header: {
        name: { fontSize: '28pt', fontWeight: 800, lineHeight: '1.15' },
        label: { fontSize: '12pt', fontWeight: 500, lineHeight: '1.4' },
        contact: { fontSize: '9.5pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '12pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '10pt', fontWeight: 500, lineHeight: '1.4' },
        body: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.4' },
      },
    },
    spacing: {
      document: { paddingX: '38pt', paddingY: '20pt' },
      section: { gap: '14pt' },
      item: { gap: '8pt' },
      line: { paragraph: '0.35rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#1E293B',
      primary: '#0F172A',
      secondary: '#0284C7',
      accent: '#0EA5E9',
      separator: '#E2E8F0',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'compact',
        tag: 'pills',
        description: 'standard',
        social: 'grid',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1pt',
        color: '#0284C7',
      },
    },
  },

  // 4. Creative Studio
  {
    id: 'creative-studio',
    name: 'Creative Studio',
    typography: {
      fontFamily: {
        heading: 'Georgia, Cambria, "Times New Roman", serif',
        body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      },
      header: {
        name: { fontSize: '30pt', fontWeight: 700, lineHeight: '1.1' },
        label: { fontSize: '13pt', fontWeight: 500, lineHeight: '1.4' },
        contact: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '13pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '10.5pt', fontWeight: 500, lineHeight: '1.4' },
        body: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.5' },
      },
    },
    spacing: {
      document: { paddingX: '44pt', paddingY: '24pt' },
      section: { gap: '16pt' },
      item: { gap: '10pt' },
      line: { paragraph: '0.5rem' },
    },
    colors: {
      background: '#FAFAF9',
      text: '#292524',
      primary: '#831843',
      secondary: '#BE185D',
      accent: '#F43F5E',
      separator: '#FBCFE8',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'center' },
      items: {
        standard: 'stacked',
        tag: 'pills',
        description: 'bordered',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '2pt',
        color: '#BE185D',
      },
    },
  },

  // 5. Corporate Slate
  {
    id: 'corporate-slate',
    name: 'Corporate Slate',
    typography: {
      fontFamily: {
        heading: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
        body: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      },
      header: {
        name: { fontSize: '26pt', fontWeight: 700, lineHeight: '1.2' },
        label: { fontSize: '12pt', fontWeight: 600, lineHeight: '1.4' },
        contact: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '12.5pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '10.5pt', fontWeight: 600, lineHeight: '1.4' },
        body: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.45' },
      },
    },
    spacing: {
      document: { paddingX: '42pt', paddingY: '22pt' },
      section: { gap: '15pt' },
      item: { gap: '8pt' },
      line: { paragraph: '0.4rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#1E293B',
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#0F172A',
      separator: '#94A3B8',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'split',
        tag: 'bullets',
        description: 'standard',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1.5pt',
        color: '#94A3B8',
      },
    },
  },

  // 6. Nordic Sage
  {
    id: 'nordic-sage',
    name: 'Nordic Sage',
    typography: {
      fontFamily: {
        heading: '"Segoe UI", system-ui, -apple-system, sans-serif',
        body: '"Segoe UI", system-ui, -apple-system, sans-serif',
      },
      header: {
        name: { fontSize: '27pt', fontWeight: 600, lineHeight: '1.2' },
        label: { fontSize: '11.5pt', fontWeight: 400, lineHeight: '1.4' },
        contact: { fontSize: '9.5pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '12pt',
          fontWeight: 600,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '10.5pt', fontWeight: 600, lineHeight: '1.4' },
        subheader: { fontSize: '10pt', fontWeight: 500, lineHeight: '1.4' },
        body: { fontSize: '9.5pt', fontWeight: 400, lineHeight: '1.5' },
      },
    },
    spacing: {
      document: { paddingX: '44pt', paddingY: '22pt' },
      section: { gap: '16pt' },
      item: { gap: '9pt' },
      line: { paragraph: '0.45rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#374151',
      primary: '#134E4A',
      secondary: '#0D9488',
      accent: '#14B8A6',
      separator: '#CCFBF1',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'split',
        tag: 'pills',
        description: 'standard',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'dashed',
        thickness: '1pt',
        color: '#0D9488',
      },
    },
  },

  // 7. Academic Scholar
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    typography: {
      fontFamily: {
        heading:
          'Garamond, "Hoefler Text", "Baskerville", "Times New Roman", serif',
        body: 'Garamond, "Hoefler Text", "Baskerville", "Times New Roman", serif',
      },
      header: {
        name: { fontSize: '28pt', fontWeight: 700, lineHeight: '1.15' },
        label: { fontSize: '12pt', fontWeight: 400, lineHeight: '1.4' },
        contact: { fontSize: '10.5pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '13.5pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11.5pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '11pt', fontWeight: 500, lineHeight: '1.4' },
        body: { fontSize: '11pt', fontWeight: 400, lineHeight: '1.5' },
      },
    },
    spacing: {
      document: { paddingX: '46pt', paddingY: '24pt' },
      section: { gap: '17pt' },
      item: { gap: '9pt' },
      line: { paragraph: '0.45rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#1C1917',
      primary: '#1C1917',
      secondary: '#7F1D1D',
      accent: '#991B1B',
      separator: '#D6D3D1',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'center' },
      items: {
        standard: 'split',
        tag: 'bullets',
        description: 'standard',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1pt',
        color: '#D6D3D1',
      },
    },
  },

  // 8. Compact ATS (1-Page)
  {
    id: 'compact-ats',
    name: 'Compact ATS (1-Page)',
    typography: {
      fontFamily: {
        heading: 'Calibri, Arial, "Segoe UI", sans-serif',
        body: 'Calibri, Arial, "Segoe UI", sans-serif',
      },
      header: {
        name: { fontSize: '22pt', fontWeight: 700, lineHeight: '1.15' },
        label: { fontSize: '10.5pt', fontWeight: 600, lineHeight: '1.3' },
        contact: { fontSize: '9pt', fontWeight: 400, lineHeight: '1.3' },
      },
      section: {
        title: {
          fontSize: '11pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '10pt', fontWeight: 700, lineHeight: '1.35' },
        subheader: { fontSize: '9.5pt', fontWeight: 600, lineHeight: '1.35' },
        body: { fontSize: '9pt', fontWeight: 400, lineHeight: '1.35' },
      },
    },
    spacing: {
      document: { paddingX: '30pt', paddingY: '18pt' },
      section: { gap: '10pt' },
      item: { gap: '6pt' },
      line: { paragraph: '0.25rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#18181B',
      primary: '#09090B',
      secondary: '#52525B',
      accent: '#27272A',
      separator: '#E4E4E7',
    },
    layout: {
      columns: { count: 1, gap: '20pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'compact',
        tag: 'comma',
        description: 'compact',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1pt',
        color: '#09090B',
      },
    },
  },

  // 9. Emerald Prestige
  {
    id: 'emerald-prestige',
    name: 'Emerald Prestige',
    typography: {
      fontFamily: {
        heading:
          '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", sans-serif',
        body: '"Segoe UI", system-ui, -apple-system, sans-serif',
      },
      header: {
        name: { fontSize: '27pt', fontWeight: 700, lineHeight: '1.2' },
        label: { fontSize: '12pt', fontWeight: 500, lineHeight: '1.4' },
        contact: { fontSize: '9.5pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '12.5pt',
          fontWeight: 700,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '10.5pt', fontWeight: 500, lineHeight: '1.4' },
        body: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.45' },
      },
    },
    spacing: {
      document: { paddingX: '42pt', paddingY: '22pt' },
      section: { gap: '15pt' },
      item: { gap: '8pt' },
      line: { paragraph: '0.4rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#1F2937',
      primary: '#064E3B',
      secondary: '#047857',
      accent: '#10B981',
      separator: '#D1FAE5',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'split',
        tag: 'pills',
        description: 'standard',
        social: 'inline',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '1.5pt',
        color: '#047857',
      },
    },
  },

  // 10. Indigo Bold
  {
    id: 'indigo-bold',
    name: 'Indigo Bold',
    typography: {
      fontFamily: {
        heading: '"Montserrat", "Segoe UI", Arial, sans-serif',
        body: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
      },
      header: {
        name: { fontSize: '28pt', fontWeight: 800, lineHeight: '1.15' },
        label: { fontSize: '12.5pt', fontWeight: 600, lineHeight: '1.4' },
        contact: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.4' },
      },
      section: {
        title: {
          fontSize: '13pt',
          fontWeight: 800,
          lineHeight: '1.2',
          textTransform: 'uppercase',
        },
      },
      item: {
        header: { fontSize: '11pt', fontWeight: 700, lineHeight: '1.4' },
        subheader: { fontSize: '10.5pt', fontWeight: 600, lineHeight: '1.4' },
        body: { fontSize: '10pt', fontWeight: 400, lineHeight: '1.45' },
      },
    },
    spacing: {
      document: { paddingX: '40pt', paddingY: '22pt' },
      section: { gap: '15pt' },
      item: { gap: '8pt' },
      line: { paragraph: '0.4rem' },
    },
    colors: {
      background: '#FFFFFF',
      text: '#1E1B4B',
      primary: '#312E81',
      secondary: '#4F46E5',
      accent: '#6366F1',
      separator: '#C7D2FE',
    },
    layout: {
      columns: { count: 1, gap: '24pt' },
      header: { alignment: 'left' },
      items: {
        standard: 'stacked',
        tag: 'grid',
        description: 'bordered',
        social: 'grid',
      },
    },
    separators: {
      section: {
        visible: true,
        style: 'solid',
        thickness: '2pt',
        color: '#4F46E5',
      },
    },
  },
]
