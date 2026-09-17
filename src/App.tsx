import { useState, useEffect, useRef, useCallback } from 'react'
import hanuLogo from './assets/hanu-logo.png'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Restaurant {
  id: number
  name: string
  address: string
  rating: number
  reviewCount: number
  distance: number
  dishes: string[]
  priceRange: string
  image: string
  openNow: boolean
  lat: number
  lng: number
}

// ─── Palette tokens ───────────────────────────────────────────────────────────
const C = {
  deep:        '#0E0202',
  dark:        '#1E0505',
  red:         '#7B1D1D',
  mid:         '#9B2D2D',
  bright:      '#C23A3A',
  gold:        '#D4A017',
  goldBright:  '#F0C040',
  white:       '#FFFFFF',
  cream:       '#FFF5EE',
  muted:       '#C49090',
  border:      'rgba(212,160,23,0.25)',
  surface:     'rgba(123,29,29,0.35)',
  surfaceHover:'rgba(155,45,45,0.4)',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DISHES = [
  { id: 'pho',       label: 'Phở',        emoji: '🍜' },
  { id: 'bun-bo',    label: 'Bún bò Huế', emoji: '🥣' },
  { id: 'banh-mi',   label: 'Bánh mì',    emoji: '🥖' },
  { id: 'com-tam',   label: 'Cơm tấm',    emoji: '🍚' },
  { id: 'bun-cha',   label: 'Bún chả',    emoji: '🍢' },
  { id: 'banh-cuon', label: 'Bánh cuốn',  emoji: '🫔' },
  { id: 'xoi',       label: 'Xôi',        emoji: '🍱' },
  { id: 'lau',       label: 'Lẩu',        emoji: '🫕' },
  { id: 'banh-xeo',  label: 'Bánh xèo',   emoji: '🥞' },
  { id: 'com-rang',  label: 'Cơm rang',   emoji: '🍳' },
  { id: 'mi-quang',  label: 'Mì Quảng',   emoji: '🍝' },
  { id: 'chao',      label: 'Cháo',       emoji: '🥣' },
]

const GACHA_POOL = [
  { emoji: '🍜', name: 'Phở',        color: '#FF6B35' },
  { emoji: '🥣', name: 'Bún bò Huế', color: '#E63946' },
  { emoji: '🥖', name: 'Bánh mì',    color: '#F4A261' },
  { emoji: '🍚', name: 'Cơm tấm',    color: '#2A9D8F' },
  { emoji: '🍢', name: 'Bún chả',    color: '#8338EC' },
  { emoji: '🫔', name: 'Bánh cuốn',  color: '#3A86FF' },
  { emoji: '🍱', name: 'Xôi',        color: '#FB5607' },
  { emoji: '🫕', name: 'Lẩu',        color: '#FF006E' },
  { emoji: '🥞', name: 'Bánh xèo',   color: '#FFBE0B' },
  { emoji: '🍳', name: 'Cơm rang',   color: '#06D6A0' },
  { emoji: '🍝', name: 'Mì Quảng',   color: '#118AB2' },
  { emoji: '🥣', name: 'Cháo',       color: '#FFB347' },
]

const RESTAURANTS: Restaurant[] = [
  {
    id: 1,
    name: 'Phở Thìn Lò Đúc',
    address: '13 Lò Đúc, Hai Bà Trưng, Hà Nội',
    rating: 4.8, reviewCount: 2341, distance: 0.8,
    dishes: ['Phở', 'Bún chả'],
    priceRange: '25.000–45.000đ',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&h=300&fit=crop&auto=format',
    openNow: true, lat: 21.0167, lng: 105.8500,
  },
  {
    id: 2,
    name: 'Bún Chả Hương Liên',
    address: '24 Lê Văn Hưu, Hai Bà Trưng, Hà Nội',
    rating: 4.7, reviewCount: 1867, distance: 1.2,
    dishes: ['Bún chả', 'Nem rán'],
    priceRange: '35.000–65.000đ',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop&auto=format',
    openNow: true, lat: 21.0134, lng: 105.8487,
  },
  {
    id: 3,
    name: 'Bánh Mì 25 Hàng Cá',
    address: '25 Hàng Cá, Hoàn Kiếm, Hà Nội',
    rating: 4.6, reviewCount: 3102, distance: 2.1,
    dishes: ['Bánh mì', 'Bánh mì thịt nướng'],
    priceRange: '20.000–35.000đ',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop&auto=format',
    openNow: true, lat: 21.0310, lng: 105.8490,
  },
  {
    id: 4,
    name: 'Cơm Tấm Mộc',
    address: '42 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    rating: 4.5, reviewCount: 892, distance: 1.5,
    dishes: ['Cơm tấm', 'Cơm rang', 'Bì sườn'],
    priceRange: '40.000–75.000đ',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format',
    openNow: false, lat: 21.0002, lng: 105.8390,
  },
  {
    id: 5,
    name: 'Lẩu Nấm Ashima',
    address: '16 Nguyễn Lương Bằng, Đống Đa, Hà Nội',
    rating: 4.6, reviewCount: 1234, distance: 3.2,
    dishes: ['Lẩu', 'Lẩu nấm', 'Lẩu hải sản'],
    priceRange: '120.000–250.000đ',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop&auto=format',
    openNow: true, lat: 21.0230, lng: 105.8421,
  },
  {
    id: 6,
    name: 'Bún Bò Huế Bà Tuyết',
    address: '8 Thái Thịnh, Đống Đa, Hà Nội',
    rating: 4.4, reviewCount: 567, distance: 2.8,
    dishes: ['Bún bò Huế', 'Bún bò giò heo'],
    priceRange: '30.000–60.000đ',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop&auto=format',
    openNow: true, lat: 21.0189, lng: 105.8356,
  },
  {
    id: 7,
    name: 'Bánh Cuốn Thanh Vân',
    address: '14 Hàng Gà, Hoàn Kiếm, Hà Nội',
    rating: 4.7, reviewCount: 445, distance: 3.5,
    dishes: ['Bánh cuốn', 'Bánh cuốn nhân thịt'],
    priceRange: '25.000–50.000đ',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop&auto=format',
    openNow: false, lat: 21.0341, lng: 105.8502,
  },
  {
    id: 8,
    name: 'Xôi Yến Nguyễn Hữu Huân',
    address: '35B Nguyễn Hữu Huân, Hoàn Kiếm',
    rating: 4.5, reviewCount: 788, distance: 4.0,
    dishes: ['Xôi', 'Xôi gà', 'Xôi lạc', 'Xôi xéo'],
    priceRange: '15.000–30.000đ',
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400&h=300&fit=crop&auto=format',
    openNow: true, lat: 21.0326, lng: 105.8529,
  },
]

// ─── Star rating ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <defs>
            <linearGradient id={`half-${s}`}>
              <stop offset="50%" stopColor={C.goldBright} />
              <stop offset="50%" stopColor="#3D1010" />
            </linearGradient>
          </defs>
          <path
            fill={
              s <= Math.floor(rating)
                ? C.goldBright
                : s - 0.5 <= rating
                ? `url(#half-${s})`
                : '#3D1010'
            }
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      ))}
    </div>
  )
}

// ─── Gacha ────────────────────────────────────────────────────────────────────
function GachaSection({ onSelectDish }: { onSelectDish: (d: string) => void }) {
  const [isSpinning, setIsSpinning]   = useState(false)
  const [result, setResult]           = useState<typeof GACHA_POOL[0] | null>(null)
  const [displayIdx, setDisplayIdx]   = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [phase, setPhase]             = useState<'idle' | 'fast' | 'slow' | 'done'>('idle')
  const timerRef   = useRef<ReturnType<typeof setTimeout>  | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = () => {
    if (timerRef.current)   clearTimeout(timerRef.current)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const spin = useCallback(() => {
    if (isSpinning) return
    setIsSpinning(true)
    setResult(null)
    setShowConfetti(false)
    setPhase('fast')

    const winnerIdx = Math.floor(Math.random() * GACHA_POOL.length)
    const winner = GACHA_POOL[winnerIdx]

    let idx = 0
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % GACHA_POOL.length
      setDisplayIdx(idx)
    }, 75)

    timerRef.current = setTimeout(() => {
      clearTimers()
      setPhase('slow')
      const delays = [140, 200, 270, 360, 460, 580]
      let i = 0
      let slowIdx = 0
      const step = () => {
        slowIdx = (slowIdx + 1) % GACHA_POOL.length
        setDisplayIdx(slowIdx)
        i++
        if (i < delays.length) {
          timerRef.current = setTimeout(step, delays[i])
        } else {
          timerRef.current = setTimeout(() => {
            setDisplayIdx(winnerIdx)
            setPhase('done')
            setIsSpinning(false)
            setResult(winner)
            setShowConfetti(true)
            timerRef.current = setTimeout(() => setShowConfetti(false), 2500)
          }, 600)
        }
      }
      timerRef.current = setTimeout(step, delays[0])
    }, 2000)
  }, [isSpinning])

  useEffect(() => () => clearTimers(), [])

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-3xl font-bold text-white mb-1.5">
          Không biết ăn gì?
        </h2>
        <p style={{ color: C.muted }} className="text-sm">
          Để <span style={{ color: C.goldBright }} className="font-semibold">HANU Eat</span> quyết định giúp bạn!
        </p>
      </div>

      <div className="flex justify-center items-center gap-8">
        {/* Lever */}
        <div
          className="flex flex-col items-center gap-2 cursor-pointer select-none"
          onClick={spin}
          style={{ opacity: isSpinning ? 0.5 : 1, transition: 'opacity 0.2s' }}
        >
          <div
            className="w-3 rounded-full transition-all duration-300"
            style={{
              height: isSpinning ? 44 : 72,
              background: `linear-gradient(to bottom, ${C.goldBright}, ${C.gold}, #8B6519)`,
              boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            }}
          />
          <div
            className="w-7 h-7 rounded-full border-2 border-red-300"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #ff7070, #C23A3A)',
              boxShadow: '0 0 12px rgba(194,58,58,0.6)',
            }}
          />
        </div>

        {/* Slot machine */}
        <div className="relative" style={{ width: 200 }}>
          <div
            className="relative rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: isSpinning ? C.goldBright : C.gold,
              background: `linear-gradient(160deg, ${C.red} 0%, ${C.dark} 100%)`,
              boxShadow: isSpinning
                ? `0 0 30px rgba(240,192,64,0.5), 0 0 70px rgba(240,192,64,0.2), inset 0 0 20px rgba(0,0,0,0.6)`
                : `0 0 20px rgba(212,160,23,0.2), inset 0 0 20px rgba(0,0,0,0.5)`,
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-center py-2.5 border-b"
              style={{
                borderColor: `${C.gold}33`,
                background: `linear-gradient(90deg, transparent, rgba(212,160,23,0.12), transparent)`,
              }}
            >
              <span style={{ color: C.goldBright }} className="font-bold text-xs tracking-[0.2em]">✦ GACHA ✦</span>
            </div>

            {/* Slot display */}
            <div
              className="mx-4 my-3 rounded-xl overflow-hidden border relative"
              style={{ height: 160, background: 'rgba(0,0,0,0.55)', borderColor: `${C.gold}33` }}
            >
              {/* Fades */}
              <div className="absolute inset-x-0 top-0 h-12 z-10 pointer-events-none"
                style={{ background: `linear-gradient(to bottom, ${C.dark}e8, transparent)` }} />
              <div className="absolute inset-x-0 bottom-0 h-12 z-10 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${C.dark}e8, transparent)` }} />
              {/* Center highlight */}
              <div
                className="absolute inset-x-3 z-10 pointer-events-none rounded-lg border"
                style={{ top: 40, height: 80, borderColor: `${C.gold}50`, background: `rgba(212,160,23,0.06)` }}
              />
              {/* Ticker */}
              <div className="h-full flex flex-col">
                {([-1, 0, 1] as const).map((offset) => {
                  const i = ((displayIdx + offset) % GACHA_POOL.length + GACHA_POOL.length) % GACHA_POOL.length
                  const item = GACHA_POOL[i]
                  const center = offset === 0
                  return (
                    <div
                      key={offset}
                      className="flex flex-col items-center justify-center flex-1"
                      style={{
                        opacity: center ? 1 : 0.3,
                        transform: center ? 'scale(1)' : 'scale(0.72)',
                        transition: isSpinning ? 'none' : 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: center ? 28 : 20 }}>{item.emoji}</div>
                      {center && (
                        <div className="text-xs font-semibold text-white mt-0.5 text-center px-2 leading-tight">
                          {item.name}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Lights */}
            <div className="flex justify-center gap-2 pb-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: isSpinning ? C.goldBright : C.gold,
                    opacity: isSpinning ? [1, 0.5, 1][i] : 0.4,
                    boxShadow: isSpinning ? `0 0 6px ${C.goldBright}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Confetti */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-base"
                  style={{
                    left: `${((i * 73) % 120) - 10}%`,
                    top: '5%',
                    animation: `confetti-fall ${0.7 + (i % 5) * 0.15}s ease-out ${i * 0.08}s forwards`,
                  }}
                >
                  {['⭐', '✨', '🎉', '🌟', '💫', '🎊'][i % 6]}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-3xl opacity-15 select-none">🎰</div>
      </div>

      {/* Result */}
      {result && phase === 'done' && (
        <div
          className="mt-6 mx-auto max-w-xs rounded-2xl p-5 text-center border"
          style={{
            background: `linear-gradient(135deg, ${C.red}99, ${C.dark}ee)`,
            borderColor: `${C.gold}80`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${C.gold}33`,
            animation: 'result-pop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div className="text-4xl mb-2">{result.emoji}</div>
          <div className="font-display text-2xl font-bold" style={{ color: C.goldBright }}>{result.name}</div>
          <p style={{ color: C.muted }} className="text-xs mt-1.5 mb-4">Số phận đã chọn cho bạn! 🎊</p>
          <button
            onClick={() => onSelectDish(result!.name)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
              color: C.dark,
              boxShadow: `0 4px 16px rgba(212,160,23,0.4)`,
            }}
          >
            Tìm quán ngay →
          </button>
        </div>
      )}

      {/* Spin button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={spin}
          disabled={isSpinning}
          className="px-8 py-3 rounded-xl font-semibold text-sm transition-all disabled:cursor-not-allowed active:scale-95"
          style={{
            background: isSpinning
              ? `rgba(123,29,29,0.4)`
              : `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`,
            color: isSpinning ? C.muted : C.dark,
            boxShadow: isSpinning ? 'none' : `0 4px 20px rgba(212,160,23,0.45)`,
            border: isSpinning ? `1px solid ${C.red}` : 'none',
          }}
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang quay...
            </span>
          ) : '🎰 Quay ngẫu nhiên!'}
        </button>
      </div>
    </div>
  )
}

// ─── Restaurant Card ───────────────────────────────────────────────────────────
function RestaurantCard({ restaurant, highlight }: { restaurant: Restaurant; highlight?: boolean }) {
  return (
    <div
      className="card-hover rounded-2xl overflow-hidden border"
      style={{
        background: `linear-gradient(135deg, ${C.red}44 0%, ${C.dark}cc 100%)`,
        borderColor: highlight ? C.gold : `${C.red}66`,
        boxShadow: highlight
          ? `0 0 0 1px ${C.gold}44, 0 8px 32px rgba(0,0,0,0.4)`
          : `0 4px 16px rgba(0,0,0,0.3)`,
        animation: 'float-in 0.4s ease-out both',
      }}
    >
      <div className="relative h-36 overflow-hidden" style={{ background: C.red }}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.8) saturate(0.9)' }}
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {highlight && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: C.gold, color: C.dark }}>
              ⭐ Top
            </span>
          )}
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: restaurant.openNow ? 'rgba(6,214,160,0.9)' : 'rgba(194,58,58,0.9)',
              color: '#fff',
            }}
          >
            {restaurant.openNow ? '● Đang mở' : '● Đã đóng'}
          </span>
        </div>
        <div
          className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(0,0,0,0.65)', color: C.goldBright }}
        >
          {restaurant.distance} km
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-white text-sm leading-tight mb-1 truncate">{restaurant.name}</h3>
        <p style={{ color: C.muted }} className="text-xs mb-2 truncate">{restaurant.address}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <StarRating rating={restaurant.rating} />
            <span style={{ color: C.goldBright }} className="text-xs font-bold">{restaurant.rating}</span>
            <span style={{ color: C.muted }} className="text-xs">({restaurant.reviewCount.toLocaleString()})</span>
          </div>
          <span style={{ color: C.muted }} className="text-xs">{restaurant.priceRange}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.dishes.slice(0, 3).map((d) => (
            <span
              key={d}
              className="px-1.5 py-0.5 rounded-md text-xs"
              style={{ background: `${C.red}55`, color: C.muted, border: `1px solid ${C.red}66` }}
            >
              {d}
            </span>
          ))}
        </div>

        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-125"
          style={{ background: `${C.red}44`, color: C.muted, border: `1px solid ${C.red}55` }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Xem trên Maps
        </a>
      </div>
    </div>
  )
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapView({ query }: { query: string }) {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden border"
      style={{ height: 360, background: C.red, borderColor: `${C.gold}33` }}
    >
      <iframe
        title="Google Maps"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query + ' gần Đại học Hà Nội')}&output=embed&hl=vi&z=14`}
        className="w-full h-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedDish, setSelectedDish] = useState<string | null>(null)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [activeView,   setActiveView]   = useState<'list' | 'map'>('list')
  const [hasLocation,  setHasLocation]  = useState(false)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setHasLocation(true),
        () => setHasLocation(false),
        { timeout: 5000 },
      )
    }
  }, [])

  const filtered = RESTAURANTS
    .filter((r) =>
      !selectedDish || r.dishes.some((d) => d.toLowerCase().includes(selectedDish.toLowerCase()))
    )
    .sort((a, b) => b.rating * 0.6 - b.distance * 0.4 - (a.rating * 0.6 - a.distance * 0.4))

  const handleDishSelect = (dish: string) => {
    setSelectedDish(dish === selectedDish ? null : dish)
    setSearchQuery('')
  }

  const handleGachaPick = (dish: string) => {
    setSelectedDish(dish)
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }), 300)
  }

  const mapQuery = selectedDish ? `quán ${selectedDish} Hà Nội` : 'quán ăn ngon Hà Nội'

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(160deg, ${C.deep} 0%, #2A0808 40%, ${C.deep} 100%)`,
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: `radial-gradient(circle, ${C.bright}, transparent)`, filter: 'blur(90px)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: `radial-gradient(circle, ${C.gold}, transparent)`, filter: 'blur(80px)' }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: `rgba(14,2,2,0.92)`,
          backdropFilter: 'blur(20px)',
          borderColor: `${C.red}55`,
        }}
      >
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={hanuLogo}
              alt="HANU Logo"
              className="rounded"
              style={{ width: 46, height: 46, objectFit: 'contain' }}
            />
            <div>
              <div className="text-xs font-medium tracking-widest uppercase" style={{ color: C.muted }}>
                Đại học Hà Nội
              </div>
              <div className="font-display font-bold text-lg leading-tight" style={{ color: C.goldBright }}>
                HANU<span className="text-white font-normal">eat</span>
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs"
            style={{
              background: hasLocation ? 'rgba(6,214,160,0.08)' : `${C.red}22`,
              borderColor: hasLocation ? 'rgba(6,214,160,0.3)' : `${C.red}55`,
              color: hasLocation ? '#06D6A0' : C.muted,
            }}
          >
            <span className={hasLocation ? 'animate-pulse' : ''}>📍</span>
            <span>{hasLocation ? 'Đã xác định vị trí' : 'Hà Nội'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-16">

        {/* ── Hero ── */}
        <section className="pt-12 pb-10 text-center" style={{ animation: 'float-in 0.6s ease-out' }}>
          {/* Logo large */}
          <div className="flex justify-center mb-5">
            <img
              src={hanuLogo}
              alt="Hanoi University"
              style={{
                width: 100,
                height: 100,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(212,160,23,0.35))',
              }}
            />
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-medium border"
            style={{ background: `${C.red}22`, borderColor: `${C.gold}44`, color: C.gold }}
          >
            <span>✦</span> HANU brings you to the world <span>✦</span>
          </div>

          <h1
            className="font-display font-black mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
          >
            <span className="text-white">Hôm nay </span>
            <span className="shimmer-text">ăn gì</span>
            <span className="text-white">?</span>
          </h1>

          <p style={{ color: C.muted }} className="max-w-md mx-auto mb-8 text-[0.95rem]">
            Chọn món yêu thích — HANU Eat tìm ngay những quán ngon nhất, gần nhất, được đánh giá cao nhất.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) setSelectedDish(null) }}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-sm outline-none border transition-all"
              style={{
                background: `${C.red}22`,
                border: `1.5px solid ${C.red}55`,
                color: C.white,
                caretColor: C.goldBright,
              }}
              onFocus={(e) => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.gold}22` }}
              onBlur={(e)  => { e.target.style.borderColor = `${C.red}55`; e.target.style.boxShadow = 'none' }}
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke={C.muted} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        {/* ── Dish selector ── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest font-semibold" style={{ color: `${C.white}55` }}>
              Chọn theo món
            </h2>
            {selectedDish && (
              <button onClick={() => setSelectedDish(null)} style={{ color: C.muted }} className="text-xs hover:text-white transition-colors">
                Bỏ chọn ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {DISHES
              .filter((d) => !searchQuery || d.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((dish) => {
                const active = selectedDish === dish.label
                return (
                  <button
                    key={dish.id}
                    onClick={() => handleDishSelect(dish.label)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${C.gold}, ${C.goldBright})`
                        : `${C.red}33`,
                      color: active ? C.dark : C.muted,
                      border: active ? `1.5px solid ${C.goldBright}` : `1.5px solid ${C.red}55`,
                      boxShadow: active ? `0 4px 16px rgba(212,160,23,0.35)` : 'none',
                      transform: active ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <span>{dish.emoji}</span>
                    <span>{dish.label}</span>
                  </button>
                )
              })}
          </div>
        </section>

        {/* ── Gacha ── */}
        <section
          className="mb-14 rounded-3xl p-8 border"
          style={{
            background: `linear-gradient(135deg, ${C.red}22 0%, ${C.dark}88 100%)`,
            borderColor: `${C.red}44`,
          }}
        >
          <GachaSection onSelectDish={handleGachaPick} />
        </section>

        {/* ── Results ── */}
        <section id="results">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                {selectedDish
                  ? <>Quán có <span style={{ color: C.goldBright }}>{selectedDish}</span></>
                  : 'Quán ăn được đề xuất'}
              </h2>
              <p style={{ color: C.muted }} className="text-sm mt-1">
                {filtered.length} quán · ưu tiên đánh giá cao &amp; gần nhất
              </p>
            </div>

            <div
              className="flex items-center gap-1 p-1 rounded-xl border"
              style={{ background: `${C.deep}99`, borderColor: `${C.red}44` }}
            >
              {(['list', 'map'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: activeView === v ? `linear-gradient(135deg, ${C.red}, ${C.mid})` : 'transparent',
                    color: activeView === v ? C.white : C.muted,
                    border: activeView === v ? `1px solid ${C.mid}` : '1px solid transparent',
                  }}
                >
                  {v === 'list' ? '≡ Danh sách' : '🗺 Bản đồ'}
                </button>
              ))}
            </div>
          </div>

          {activeView === 'map' && <div className="mb-6"><MapView query={mapQuery} /></div>}

          {filtered.length > 0 ? (
            <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {filtered.map((r, i) => (
                <div key={r.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <RestaurantCard restaurant={r} highlight={i === 0} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16 rounded-2xl border"
              style={{ background: `${C.red}11`, borderColor: `${C.red}33` }}
            >
              <div className="text-4xl mb-3">🍽️</div>
              <p style={{ color: C.muted }}>Chưa tìm thấy quán phù hợp</p>
              <p style={{ color: C.muted }} className="text-sm mt-1">Thử chọn món khác hoặc mở rộng tìm kiếm</p>
            </div>
          )}
        </section>

        {/* ── Footer ── */}
        <footer className="mt-20 pt-8 border-t text-center" style={{ borderColor: `${C.red}33` }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={hanuLogo} alt="HANU" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span className="font-display font-bold" style={{ color: C.goldBright }}>HANUeat</span>
          </div>
          <p style={{ color: C.muted }} className="text-xs italic mb-1">"HANU brings you to the world"</p>
          <p style={{ color: `${C.muted}88` }} className="text-xs">Km9 Nguyễn Trãi, Thanh Xuân, Hà Nội · Đại học Hà Nội</p>
        </footer>
      </main>
    </div>
  )
}
