/* Genera los iconos PNG de la PWA desde public/icon-src.svg (sello 墨 sobre rojo).
   Uso: node scripts/gen-icons.mjs */
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('public/icon-src.svg')
const OUT = path.resolve('public/icons')
const BG = '#C8102E'
await mkdir(OUT, { recursive: true })
const svg = await readFile(SRC)

const jobs = [
  [192, 'pwa-192.png'],
  [512, 'pwa-512.png'],
  [180, 'apple-touch-icon.png'],
]
for (const [size, name] of jobs) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(OUT, name))
}
// Maskable: el launcher recorta hasta un 20% por lado → encogemos el sello a la
// zona segura central y rellenamos el borde con el rojo de fondo.
await sharp(svg, { density: 384 })
  .resize(408, 408)
  .extend({ top: 52, bottom: 52, left: 52, right: 52, background: BG })
  .png()
  .toFile(path.join(OUT, 'maskable-512.png'))
console.log('iconos generados:', jobs.map((j) => j[1]).join(', '))
