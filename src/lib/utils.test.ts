import { describe, expect, it } from 'vitest'
import { splitLeadingYear } from './utils'

describe('splitLeadingYear', () => {
  it('splits a single year', () => {
    expect(splitLeadingYear('2025 - Diplôme HMONP')).toEqual(['2025', ' - Diplôme HMONP'])
  })

  it('keeps a year range together', () => {
    expect(splitLeadingYear('2019 – 2021 - Licence')).toEqual(['2019 – 2021', ' - Licence'])
  })

  it('leaves text without a leading year alone', () => {
    expect(splitLeadingYear('Licence 2018')).toEqual(['', 'Licence 2018'])
    expect(splitLeadingYear('20250 m²')).toEqual(['', '20250 m²'])
  })
})
