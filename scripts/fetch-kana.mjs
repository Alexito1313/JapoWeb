/* Descarga los SVG de KanjiVG de los silabarios (hiragana + katakana, gojūon +
   dakuten/handakuten) a public/kanjivg/{codepoint}.svg, para que el trazado de
   kana funcione offline (igual scheme que los kanji).
   Uso: node scripts/fetch-kana.mjs */
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('public/kanjivg')
const cp = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0')

const KANA =
  // hiragana gojūon
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
  // hiragana dakuten / handakuten
  'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ' +
  // katakana gojūon
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  // katakana dakuten / handakuten
  'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ'

const chars = [...new Set([...KANA])]
await mkdir(OUT, { recursive: true })
let ok = 0
let skip = 0
let fail = 0
for (const ch of chars) {
  const code = cp(ch)
  const dest = path.join(OUT, code + '.svg')
  if (existsSync(dest)) {
    skip++
    continue
  }
  try {
    const r = await fetch(`https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${code}.svg`)
    if (!r.ok) {
      fail++
      console.warn('fallo', ch, code, r.status)
      continue
    }
    await writeFile(dest, await r.text(), 'utf8')
    ok++
  } catch (e) {
    fail++
    console.warn('error', ch, code, e.message)
  }
}
console.log(`Kana: ${ok} descargados · ${skip} ya estaban · ${fail} fallos · ${chars.length} kana`)
