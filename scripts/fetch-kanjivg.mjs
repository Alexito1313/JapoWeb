/* Descarga los SVG de KanjiVG de los kanji de 1 carácter del temario a
   public/kanjivg/{codepoint}.svg, para que el modo escritura funcione offline.
   Uso: node scripts/fetch-kanjivg.mjs */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const DATA = path.resolve('public/data/kanji')
const OUT = path.resolve('public/kanjivg')
const cp = (ch) => ch.codePointAt(0).toString(16).padStart(5, '0')

const files = (await readdir(DATA)).filter((f) => f.endsWith('.json'))
const kanji = new Set()
for (const f of files) {
  const arr = JSON.parse(await readFile(path.join(DATA, f), 'utf8'))
  for (const it of arr) if ([...it.jp].length === 1) kanji.add(it.jp)
}

await mkdir(OUT, { recursive: true })
let ok = 0
let skip = 0
let fail = 0
for (const ch of kanji) {
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
console.log(`KanjiVG: ${ok} descargados · ${skip} ya estaban · ${fail} fallos · ${kanji.size} kanji totales`)
