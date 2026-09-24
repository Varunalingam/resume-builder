import { describe, expect, it } from 'vitest'
import { set } from './utils.ts'

describe('utils: set', () => {
  it('sets a simple top-level key', () => {
    const obj: Record<string, unknown> = {}
    set(obj, 'title', 'Developer')
    expect(obj.title).toBe('Developer')
  })

  it('sets a nested property by dot notation path', () => {
    const obj: Record<string, unknown> = {}
    set(obj, 'layout.columns.count', 2)
    expect(obj).toEqual({
      layout: {
        columns: {
          count: 2,
        },
      },
    })
  })

  it('overwrites existing nested value while preserving siblings', () => {
    const obj = {
      theme: {
        colors: {
          primary: '#000000',
          secondary: '#555555',
        },
      },
    }
    set(obj, 'theme.colors.primary', '#0070f3')
    expect(obj.theme.colors.primary).toBe('#0070f3')
    expect(obj.theme.colors.secondary).toBe('#555555')
  })

  it('creates intermediate objects if path is missing', () => {
    const obj: Record<string, unknown> = { existing: true }
    set(obj, 'a.b.c.d', 'deepValue')
    expect(obj).toEqual({
      existing: true,
      a: {
        b: {
          c: {
            d: 'deepValue',
          },
        },
      },
    })
  })
})
