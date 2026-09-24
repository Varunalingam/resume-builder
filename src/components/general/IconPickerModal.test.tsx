import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import IconPickerModal from './IconPickerModal.tsx'

describe('<IconPickerModal />', () => {
  it('returns null when isOpen is false', () => {
    const html = renderToStaticMarkup(
      <IconPickerModal
        isOpen={false}
        onClose={() => {}}
        onSelectIcon={() => {}}
      />,
    )
    expect(html).toBe('')
  })

  it('renders modal header, popular icons, and search input when isOpen is true', () => {
    const html = renderToStaticMarkup(
      <IconPickerModal
        isOpen={true}
        onClose={() => {}}
        onSelectIcon={() => {}}
        sectionTitle="Work Experience"
        currentIcon="briefcase"
      />,
    )
    expect(html).toContain('Choose Section Icon')
    expect(html).toContain('Work Experience')
    expect(html).toContain('Search Icons8')
    expect(html).toContain('Recommended Icons')
    expect(html).toContain('briefcase')
    expect(html).toContain('rocket')
  })
})
