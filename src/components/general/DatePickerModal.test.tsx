import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import DatePickerModal from './DatePickerModal.tsx'

describe('<DatePickerModal />', () => {
  it('returns null when isOpen is false', () => {
    const html = renderToStaticMarkup(
      <DatePickerModal
        isOpen={false}
        onClose={() => {}}
        onSave={() => {}}
        startDate="Jan 2021"
        endDate="Present"
      />,
    )
    expect(html).toBe('')
  })

  it('renders modal header, present checkbox, and date selectors when isOpen is true', () => {
    const html = renderToStaticMarkup(
      <DatePickerModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        startDate="Jan 2020"
        endDate="Present"
        itemTitle="Software Engineer — Google"
      />,
    )
    expect(html).toContain('Date Range Picker')
    expect(html).toContain('Software Engineer — Google')
    expect(html).toContain('Present')
    expect(html).toContain('Jan')
    expect(html).toContain('2020')
    expect(html).toContain('Apply Dates')
    expect(html).toContain('Clear Dates')
    expect(html).toContain('Formatted Date Preview')
  })

  it('renders ongoing indicator and present end date when endDate is Present', () => {
    const html = renderToStaticMarkup(
      <DatePickerModal
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
        startDate="Sep 2019"
        endDate="Present"
      />,
    )
    expect(html).toContain('Ongoing')
    expect(html).toContain('End date is locked to &quot;Present&quot;')
    expect(html).toContain('Sep 2019 — Present')
  })
})
