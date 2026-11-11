import { describe, expect, it } from 'vitest'
import { lignesDe, splitLeadingYear, texteMinimalHtml, texteSeul } from './utils'

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

describe('lignesDe', () => {
  it('splits an old textarea on newlines, without dashes or blank lines', () => {
    expect(lignesDe('- Visite\n\n• Relevé \n')).toEqual(['Visite', 'Relevé'])
  })

  it('splits wysiwyg html on line breaks and paragraphs, keeping inline tags', () => {
    expect(lignesDe('<p>Visite <strong>sur site</strong><br />\nRelevé</p>\n<p>&nbsp;</p>\n<p><em>Esquisse</em></p>')).toEqual([
      'Visite <strong>sur site</strong>',
      'Relevé',
      '<em>Esquisse</em>',
    ])
  })

  it('splits aligned paragraphs and subtitles, keeping size spans', () => {
    expect(
      lignesDe('<h4>Étapes</h4>\n<p style="text-align: center;">Visite <span class="taille-grand">sur site</span></p>'),
    ).toEqual(['Étapes', 'Visite <span class="taille-grand">sur site</span>'])
  })

  it('splits a pasted list whose tags WordPress removed', () => {
    expect(lignesDe('<p>Intro</p>\n\nVisite\nRelevé\n\n')).toEqual(['Intro', 'Visite', 'Relevé'])
  })

  it('splits list items', () => {
    expect(lignesDe('<ul><li>Visite</li><li>Relevé</li></ul>')).toEqual(['Visite', 'Relevé'])
  })
})

describe('texteSeul', () => {
  it('sees an empty paragraph as empty', () => {
    expect(texteSeul('<p>&nbsp;</p>')).toBe('')
    expect(texteSeul('<p><strong>Analyse</strong></p>')).toBe('Analyse')
  })
})

describe('texteMinimalHtml', () => {
  const puce = (marque: string, texte: string) =>
    `<span class="ligne-puce"><span class="ligne-puce-marque">${marque} </span><span>${texte}</span></span>`

  it('gives bullet lines their own block, without the line breaks around them', () => {
    expect(texteMinimalHtml('<p>Intro<br />\nSuite</p>\n<p>• Plans<br />\n&#8211; <strong>Coupes</strong><br />\nFin</p>')).toBe(
      `<p>Intro<br />\nSuite</p>\n<p>${puce('•', 'Plans')}${puce('&#8211;', '<strong>Coupes</strong>')}Fin</p>`,
    )
  })

  it('makes old plain text html, escaped', () => {
    expect(texteMinimalHtml('a < b\nc\n\n• d')).toBe(`<p>a &lt; b<br />c</p><p>${puce('•', 'd')}</p>`)
  })

  it('drops empty spans left by a paste, keeps size spans', () => {
    expect(texteMinimalHtml('<p>• a<span><br />\n</span>• <span class="taille-grand">b</span></p>')).toBe(
      `<p>${puce('•', 'a')}${puce('•', '<span class="taille-grand">b</span>')}</p>`,
    )
  })

  it('leaves dashes inside a line alone', () => {
    expect(texteMinimalHtml('<p>Programme – Budget</p>')).toBe('<p>Programme – Budget</p>')
  })
})
