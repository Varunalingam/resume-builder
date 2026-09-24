import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ImageCropModal from './ImageCropModal.tsx'

describe('ImageCropModal', () => {
  it('does not render when isOpen is false', () => {
    const html = renderToStaticMarkup(
      <ImageCropModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />,
    )
    expect(html).toBe('')
  })

  it('renders upload empty state when isOpen is true and no photo provided', () => {
    const html = renderToStaticMarkup(
      <ImageCropModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />,
    )
    expect(html).toContain('Passport Size Photo (35 × 45 mm)')
    expect(html).toContain('Select Your Passport Photo')
    expect(html).toContain('Choose Photo from Device')
    expect(html).toContain('Cancel')
    expect(html).toContain('dark:bg-gray-900')
  })

  it('renders cropping view and remove button when currentPhotoUrl is provided', () => {
    const html = renderToStaticMarkup(
      <ImageCropModal
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        onRemove={vi.fn()}
        currentPhotoUrl="data:image/png;base64,sample"
      />,
    )
    expect(html).toContain('35 × 45 mm Frame')
    expect(html).toContain('Zoom:')
    expect(html).toContain('Rotate')
    expect(html).toContain('Re-center')
    expect(html).toContain('Remove Photo')
    expect(html).toContain('Apply &amp; Save Photo')
    expect(html).toContain('dark:bg-gray-800/80')
    expect(html).toContain('dark:hover:bg-gray-600')
  })
})
