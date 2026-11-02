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
