import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
}

// Sans DOMParser pour fonctionner aussi en SSR.
export function decodeEntities(html: string): string {
  return html.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const isHex = code[1].toLowerCase() === 'x'
      const point = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10)
      return point <= 0x10ffff ? String.fromCodePoint(point) : match
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match
  })
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Anchor typed in WordPress, else the title; duplicates get a suffix.
export function sectionIds(sections: { titre: string; ancre: string }[]): string[] {
  const seen = new Map<string, number>()
  return sections.map((section, i) => {
    const id = slugify(section.ancre || section.titre) || `section-${i + 1}`
    const count = seen.get(id) ?? 0
    seen.set(id, count + 1)
    return count ? `${id}-${count + 1}` : id
  })
}

// "2019-2021 - Licence" -> ["2019-2021", " - Licence"]; no leading year -> ["", text].
export function splitLeadingYear(text: string): [string, string] {
  const year = /^\s*\d{4}(?:\s*[-–/]\s*\d{4})?(?!\d)/.exec(text)?.[0] ?? ''
  return [year, text.slice(year.length)]
}

const balise = /<[a-z][^>]*>/i;

export const estHtml = (valeur: string) => balise.test(valeur);

// Text a reader would see: no tags, no &nbsp;.
export const texteSeul = (valeur: string) => valeur.replace(/<[^>]*>|&nbsp;/g, " ").trim();

// One bullet per line: a line break, a paragraph, a subtitle or a list item (WYSIWYG), or a newline (old textarea).
// Their alignment is dropped, bullets stay justified.
export function lignesDe(valeur: string): string[] {
  const html = estHtml(valeur);
  return valeur
    .split(html ? /<br\s*\/?>|<\/?(?:p|h4|ul|ol|li)(?:\s[^>]*)?>/i : "\n")
    .map((ligne) => ligne.replace(/^\s*[-•*]\s*/, "").trim())
    .filter((ligne) => (html ? texteSeul(ligne) : ligne));
}
