/* ============================================================
   Silabarios: hiragana y katakana (gojūon + dakuten/handakuten).
   Cada cuadrícula es filas de 5 columnas (a/i/u/e/o); null = hueco.
   romaji = lectura Hepburn. Usado por las tablas de la pestaña Tablas.
   ============================================================ */

export interface KanaCell {
  ch: string
  romaji: string
}
export type KanaGrid = (KanaCell | null)[][]

const _ = null
const k = (ch: string, romaji: string): KanaCell => ({ ch, romaji })

export const HIRAGANA: { gojuon: KanaGrid; dakuten: KanaGrid } = {
  gojuon: [
    [k('あ', 'a'), k('い', 'i'), k('う', 'u'), k('え', 'e'), k('お', 'o')],
    [k('か', 'ka'), k('き', 'ki'), k('く', 'ku'), k('け', 'ke'), k('こ', 'ko')],
    [k('さ', 'sa'), k('し', 'shi'), k('す', 'su'), k('せ', 'se'), k('そ', 'so')],
    [k('た', 'ta'), k('ち', 'chi'), k('つ', 'tsu'), k('て', 'te'), k('と', 'to')],
    [k('な', 'na'), k('に', 'ni'), k('ぬ', 'nu'), k('ね', 'ne'), k('の', 'no')],
    [k('は', 'ha'), k('ひ', 'hi'), k('ふ', 'fu'), k('へ', 'he'), k('ほ', 'ho')],
    [k('ま', 'ma'), k('み', 'mi'), k('む', 'mu'), k('め', 'me'), k('も', 'mo')],
    [k('や', 'ya'), _, k('ゆ', 'yu'), _, k('よ', 'yo')],
    [k('ら', 'ra'), k('り', 'ri'), k('る', 'ru'), k('れ', 're'), k('ろ', 'ro')],
    [k('わ', 'wa'), _, _, _, k('を', 'wo')],
    [k('ん', 'n'), _, _, _, _],
  ],
  dakuten: [
    [k('が', 'ga'), k('ぎ', 'gi'), k('ぐ', 'gu'), k('げ', 'ge'), k('ご', 'go')],
    [k('ざ', 'za'), k('じ', 'ji'), k('ず', 'zu'), k('ぜ', 'ze'), k('ぞ', 'zo')],
    [k('だ', 'da'), k('ぢ', 'ji'), k('づ', 'zu'), k('で', 'de'), k('ど', 'do')],
    [k('ば', 'ba'), k('び', 'bi'), k('ぶ', 'bu'), k('べ', 'be'), k('ぼ', 'bo')],
    [k('ぱ', 'pa'), k('ぴ', 'pi'), k('ぷ', 'pu'), k('ぺ', 'pe'), k('ぽ', 'po')],
  ],
}

export const KATAKANA: { gojuon: KanaGrid; dakuten: KanaGrid } = {
  gojuon: [
    [k('ア', 'a'), k('イ', 'i'), k('ウ', 'u'), k('エ', 'e'), k('オ', 'o')],
    [k('カ', 'ka'), k('キ', 'ki'), k('ク', 'ku'), k('ケ', 'ke'), k('コ', 'ko')],
    [k('サ', 'sa'), k('シ', 'shi'), k('ス', 'su'), k('セ', 'se'), k('ソ', 'so')],
    [k('タ', 'ta'), k('チ', 'chi'), k('ツ', 'tsu'), k('テ', 'te'), k('ト', 'to')],
    [k('ナ', 'na'), k('ニ', 'ni'), k('ヌ', 'nu'), k('ネ', 'ne'), k('ノ', 'no')],
    [k('ハ', 'ha'), k('ヒ', 'hi'), k('フ', 'fu'), k('ヘ', 'he'), k('ホ', 'ho')],
    [k('マ', 'ma'), k('ミ', 'mi'), k('ム', 'mu'), k('メ', 'me'), k('モ', 'mo')],
    [k('ヤ', 'ya'), _, k('ユ', 'yu'), _, k('ヨ', 'yo')],
    [k('ラ', 'ra'), k('リ', 'ri'), k('ル', 'ru'), k('レ', 're'), k('ロ', 'ro')],
    [k('ワ', 'wa'), _, _, _, k('ヲ', 'wo')],
    [k('ン', 'n'), _, _, _, _],
  ],
  dakuten: [
    [k('ガ', 'ga'), k('ギ', 'gi'), k('グ', 'gu'), k('ゲ', 'ge'), k('ゴ', 'go')],
    [k('ザ', 'za'), k('ジ', 'ji'), k('ズ', 'zu'), k('ゼ', 'ze'), k('ゾ', 'zo')],
    [k('ダ', 'da'), k('ヂ', 'ji'), k('ヅ', 'zu'), k('デ', 'de'), k('ド', 'do')],
    [k('バ', 'ba'), k('ビ', 'bi'), k('ブ', 'bu'), k('ベ', 'be'), k('ボ', 'bo')],
    [k('パ', 'pa'), k('ピ', 'pi'), k('プ', 'pu'), k('ペ', 'pe'), k('ポ', 'po')],
  ],
}
