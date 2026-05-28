import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'
import { useContent } from '../data/useContent'
import {
  KANJI_BLOCKS,
  VOCAB_BLOCKS,
  countByBlock,
  dailyIndex,
  type Card,
} from '../data/content'
import { Backdrop } from '../components/Backdrop'
import { Topbar } from '../components/Topbar'

type ContentSel = 'kanji' | 'vocab' | 'both'

const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土']

function greeting(d = new Date()) {
  const h = d.getHours()
  const text =
    h < 6 ? 'Buenas noches.' : h < 12 ? 'Buenos días.' : h < 20 ? 'Buenas tardes.' : 'Buenas noches.'
  const jpSub = h < 6 ? 'こんばんは' : h < 12 ? 'おはよう' : h < 20 ? 'こんにちは' : 'こんばんは'
  const meta = `${WEEKDAYS_JP[d.getDay()]}曜日 · ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes(),
  ).padStart(2, '0')}`
  return { text, jpSub, meta }
}

/* ---------- sub-componentes presentacionales ---------- */

function SectionTitle({ title, jp, toggle }: { title: string; jp?: string; toggle?: string }) {
  return (
    <div className="section-title">
      <h3>
        <span className="stroke"></span>
        {title}
        {jp && <span className="jp-side">{jp}</span>}
      </h3>
      {toggle && <span className="toggle">{toggle}</span>}
    </div>
  )
}

function StreakMini({ onOpenCalendar }: { onOpenCalendar: () => void }) {
  // Sin progreso real todavía (llega en la Fase 3): hoy marcado, resto vacío.
  const week = [0, 0, 0, 0, 0, 0, 2]
  const days = 0
  const completed = week.filter((d) => d === 1).length
  return (
    <div className="streak-mini" onClick={onOpenCalendar} style={{ cursor: 'pointer' }}>
      <span className="pill">
        <span className="n">{days}</span>
        <span className="lbl">días · racha</span>
      </span>
      <span className="sep"></span>
      <span className="pill" style={{ gap: 8 }}>
        <span className="dots">
          {week.map((d, i) => (
            <span key={i} className={'dot ' + (d === 1 ? 'done' : d === 2 ? 'today' : '')}></span>
          ))}
        </span>
        <span className="lbl">{completed}/7 semana</span>
      </span>
    </div>
  )
}

function DailyMini({ card, onOpen }: { card: Card; onOpen: () => void }) {
  return (
    <button className="daily-mini" onClick={onOpen}>
      <div className="mini-kanji">{card.jp}</div>
      <div className="mini-info">
        <div className="mini-eyebrow">Kanji del día · 今日</div>
        <div className="mini-meaning">{card.mean}</div>
        <div className="mini-reading">
          {card.read} · {card.block}
        </div>
      </div>
      <div className="mini-arrow">→</div>
    </button>
  )
}

function LevelSelector() {
  const levels = [
    { id: 'J1', sub: '1º año', locked: true },
    { id: 'J2', sub: '2º año', locked: true },
    { id: 'J3', sub: '3º año', locked: false },
    { id: 'J4', sub: '4º año', locked: true },
    { id: 'J5', sub: '5º año', locked: true },
    { id: 'J6', sub: '6º año', locked: true },
    { id: 'J7', sub: '7º año', locked: true },
  ]
  return (
    <div className="levels">
      {levels.map((l) => {
        let cls = 'level'
        if (l.id === 'J3') cls += ' active'
        else if (l.locked) cls += ' locked'
        return (
          <button key={l.id} className={cls} disabled={l.locked}>
            <span className="l-id">{l.id}</span>
            <span className="l-sub">{l.sub}</span>
          </button>
        )
      })}
    </div>
  )
}

function ContentChips({
  active,
  onSelect,
}: {
  active: ContentSel
  onSelect: (id: ContentSel) => void
}) {
  const items: { id: ContentSel; label: string; jp: string }[] = [
    { id: 'kanji', label: 'Kanji', jp: '漢字' },
    { id: 'vocab', label: 'Vocabulario', jp: '語彙' },
    { id: 'both', label: 'Ambos', jp: '両方' },
  ]
  return (
    <div className="chips">
      {items.map((i) => (
        <button
          key={i.id}
          className={'chip ' + (active === i.id ? 'active' : '')}
          onClick={() => onSelect(i.id)}
        >
          {i.label}
          <span className="jp-tiny">{i.jp}</span>
        </button>
      ))}
    </div>
  )
}

function TypeChips({ active, onSelect }: { active: string; onSelect: (l: string) => void }) {
  // Nota: el filtrado real por tipo se aplica al mazo en la Fase 2 (modos).
  const items = [
    { label: 'Todos', jp: '全部' },
    { label: 'Verbos', jp: '動詞' },
    { label: 'Sustantivos', jp: '名詞' },
    { label: 'Adj. い', jp: 'い形' },
    { label: 'Adj. な', jp: 'な形' },
    { label: 'Adverbios', jp: '副詞' },
  ]
  return (
    <div className="chips">
      {items.map((i) => (
        <button
          key={i.label}
          className={'chip ' + (active === i.label ? 'active' : '')}
          onClick={() => onSelect(i.label)}
        >
          {i.label}
          <span className="jp-tiny">{i.jp}</span>
        </button>
      ))}
    </div>
  )
}

function BlockGrid({
  blocks,
  isSelected,
  onToggle,
}: {
  blocks: { id: string; count: number }[]
  isSelected: (id: string) => boolean
  onToggle: (id: string) => void
}) {
  return (
    <div className="blocks">
      {blocks.map((b) => (
        <button
          key={b.id}
          className={'block ' + (isSelected(b.id) ? 'active' : '')}
          onClick={() => onToggle(b.id)}
        >
          <span className="b-id">{b.id}</span>
          <span className="b-count">
            {b.count} {b.id[0] === 'D' ? 'kanji' : 'palabras'}
          </span>
        </button>
      ))}
    </div>
  )
}

function ModeTiles({ go }: { go: (path: string) => void }) {
  return (
    <div className="modes">
      <div className="mode primary" onClick={() => go('/flash')} style={{ cursor: 'pointer' }}>
        <div className="m-row">
          <span className="m-kanji">札</span>
          <span className="m-pill">RECOMENDADO</span>
        </div>
        <div className="m-title">Flashcards</div>
        <div className="m-desc">Toca para voltear · desliza para responder</div>
      </div>
      <div className="mode" onClick={() => go('/test')} style={{ cursor: 'pointer' }}>
        <div className="m-row">
          <span className="m-kanji">試</span>
          <span className="m-pill">TEST</span>
        </div>
        <div className="m-title">Opción múltiple</div>
        <div className="m-desc">4 opciones del mismo tipo</div>
      </div>
      <div className="mode" onClick={() => go('/repaso')} style={{ cursor: 'pointer' }}>
        <div className="m-row">
          <span className="m-kanji">復</span>
          <span className="m-pill">REPASO</span>
        </div>
        <div className="m-title">Más falladas</div>
        <div className="m-desc">Las que peor llevas, primero</div>
      </div>
      <div className="mode" onClick={() => go('/escritura')} style={{ cursor: 'pointer' }}>
        <div className="m-row">
          <span className="m-kanji">書</span>
          <span className="m-pill">PRÓX.</span>
        </div>
        <div className="m-title">Escritura</div>
        <div className="m-desc">Trazar el kanji con el dedo</div>
        <div className="new-pill">新</div>
      </div>
      <div className="mode full" onClick={() => go('/simulacro')} style={{ cursor: 'pointer' }}>
        <div className="m-row">
          <span className="m-kanji">検</span>
          <span className="m-pill">EXAMEN JLPT</span>
        </div>
        <div className="m-title">Simulacro cronometrado</div>
        <div className="m-desc">formato N4 · cronometrado</div>
        <div className="new-pill">新</div>
      </div>
    </div>
  )
}

function StartButton({ count, onStart }: { count: number; onStart: () => void }) {
  return (
    <div className="start-wrap">
      <button className="btn-start" onClick={onStart} disabled={count === 0}>
        <div className="btn-start-content">
          <span>Empezar · {count} cartas</span>
          <span className="sub">始めましょう</span>
        </div>
        <span className="arrow">→</span>
      </button>
    </div>
  )
}

/* ---------- pantalla principal ---------- */

export function HomeScreen() {
  const { variant } = useTheme()
  const { content, loading } = useContent()
  const navigate = useNavigate()
  const go = (path: string) => navigate(path)

  const [contentSel, setContentSel] = useState<ContentSel>('kanji')
  const [typeSel, setTypeSel] = useState('Todos')
  const [deselected, setDeselected] = useState<Set<string>>(new Set())

  const greet = useMemo(() => greeting(), [])
  const kanjiCounts = useMemo(() => (content ? countByBlock(content.kanji) : {}), [content])
  const vocabCounts = useMemo(() => (content ? countByBlock(content.vocab) : {}), [content])

  const blocks = useMemo(() => {
    const out: { id: string; count: number }[] = []
    if (contentSel !== 'vocab') KANJI_BLOCKS.forEach((b) => out.push({ id: b, count: kanjiCounts[b] ?? 0 }))
    if (contentSel !== 'kanji') VOCAB_BLOCKS.forEach((b) => out.push({ id: b, count: vocabCounts[b] ?? 0 }))
    return out
  }, [contentSel, kanjiCounts, vocabCounts])

  const total = blocks.filter((b) => !deselected.has(b.id)).reduce((s, b) => s + b.count, 0)

  const daily = useMemo(
    () => (content && content.kanji.length ? content.kanji[dailyIndex(content.kanji.length)] : null),
    [content],
  )

  const changeContent = (c: ContentSel) => {
    setContentSel(c)
    setDeselected(new Set())
  }
  const toggleBlock = (id: string) =>
    setDeselected((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  if (loading || !content) {
    return (
      <div className="home-frame">
        <div className="home-loading">読み込み中… · cargando contenido</div>
      </div>
    )
  }

  return (
    <div className="home-frame">
      <Backdrop variant={variant} />
      <div className="home-content">
        <Topbar active="home" />

        <div className="greet-wrap">
          <div className="greet-eyebrow">
            <span className="dot"></span>
            <span className="meta">{greet.meta}</span>
          </div>
          <h1 className="greet-title">
            {greet.text}
            <span className="jp-sub">{greet.jpSub} — sigamos donde lo dejaste</span>
          </h1>
        </div>

        <StreakMini onOpenCalendar={() => go('/calendar')} />
        {daily && (
          <DailyMini card={daily} onOpen={() => go(`/detail/${encodeURIComponent(daily.jp)}`)} />
        )}

        <SectionTitle title="Nivel" jp="級" toggle="J3 activo" />
        <LevelSelector />

        <SectionTitle title="Contenido" jp="教材" />
        <ContentChips active={contentSel} onSelect={changeContent} />

        <SectionTitle
          title="Bloques"
          jp={contentSel === 'vocab' ? 'MNN · L26—L36' : 'J3 · D1—D10'}
          toggle={`${total} cartas`}
        />
        <BlockGrid blocks={blocks} isSelected={(id) => !deselected.has(id)} onToggle={toggleBlock} />

        <SectionTitle title="Filtro por tipo" jp="品詞" />
        <TypeChips active={typeSel} onSelect={setTypeSel} />

        <SectionTitle title="Modo de estudio" jp="学習方法" />
        <ModeTiles go={go} />

        <StartButton count={total} onStart={() => go('/flash')} />
      </div>
    </div>
  )
}
