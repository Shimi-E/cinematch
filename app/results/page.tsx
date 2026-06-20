"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { MOVIES, GENRE_NAMES, buildDNA, dnaToPersonality } from "@/lib/movies"
import { saveProfile } from "@/lib/supabase"

type MovieWithPoster = {
  id: number
  title: string
  year: number
  genre: string
  tier: string
  poster: string | null
  overview: string
  tmdb_score: number
}

function analyzeProfile(ratings: Record<string, string>) {
  const scores: Record<string, number> = { loved_much: 5, loved: 4, ok: 3, disliked: 1, unseen: 0 }

  const genreScores: Record<string, number[]> = {}
  MOVIES.forEach(m => {
    const key = `${m.id}-${m.genre}`
    const rating = ratings[key]
    if (!rating || rating === "unseen") return
    const score = scores[rating] || 0
    if (!genreScores[m.genre]) genreScores[m.genre] = []
    genreScores[m.genre].push(score)
  })

  const avgGenre = Object.entries(genreScores).map(([g, s]) => ({
    genre: g,
    avg: s.reduce((a, b) => a + b, 0) / s.length
  })).sort((a, b) => b.avg - a.avg)

  const topGenre = avgGenre[0]?.genre || "action"
  const dna = buildDNA(ratings)
  const { title: personality, description } = dnaToPersonality(dna)

  return { personality, description, topGenre, avgGenre, dna }
}

function ResultsPage() {
  const searchParams = useSearchParams()
  const triviaScore = parseInt(searchParams.get("trivia") || "0")
  const triviaTotal = parseInt(searchParams.get("triviaTotal") || "0")
  const ratingsRaw = searchParams.get("ratings") || "{}"
  const ratings: Record<string, string> = JSON.parse(decodeURIComponent(ratingsRaw))

  const [unseen, setUnseen] = useState<MovieWithPoster[]>([])
  const [current, setCurrent] = useState(0)
  const [watchlist, setWatchlist] = useState<MovieWithPoster[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [phase, setPhase] = useState<"analysis" | "tinder" | "watchlist">("analysis")
  const [showSeenMenu, setShowSeenMenu] = useState(false)
  const [isHeavyWatcher, setIsHeavyWatcher] = useState(false)
  const [wave, setWave] = useState(1)
  const [shareSlug, setShareSlug] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)

  const { personality, description, topGenre, avgGenre, dna } = analyzeProfile(ratings)

  useEffect(() => {
    saveProfile({
      personality,
      dna,
      topGenre,
      ratings,
      triviaScore,
      totalRated: Object.values(ratings).filter(r => r !== "unseen").length,
    }).then(slug => { if (slug) setShareSlug(slug) })
  }, [])

  useEffect(() => {
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratings }),
    })
      .then(r => r.json())
      .then(data => {
        const recs = data.recommendations || []
        setUnseen(recs)
        // זיהוי פריק: ראה יותר מ-70% מהסרטים שהמלצנו
        if (data.seenRatio && data.seenRatio > 0.7) setIsHeavyWatcher(true)
        setLoading(false)
      })
  }, [])

  function fetchMoreRecs() {
    const nextWave = wave + 1
    setWave(nextWave)
    setLoadingMore(true)
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ratings, wave: nextWave }),
    })
      .then(r => r.json())
      .then(data => {
        setUnseen(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const newMovies = (data.recommendations || []).filter((m: MovieWithPoster) => !existingIds.has(m.id))
          return [...prev, ...newMovies]
        })
        setLoadingMore(false)
      })
  }

  function swipeRight() {
    setWatchlist(prev => [...prev, unseen[current]])
    setCurrent(c => c + 1)
    setShowSeenMenu(false)
  }

  function swipeLeft() {
    setCurrent(c => c + 1)
    setShowSeenMenu(false)
  }

  function swipeSeen(_rating: "loved" | "ok" | "disliked") {
    // ראיתי = לא נכנס לרשימה, רק מדלג
    setCurrent(c => c + 1)
    setShowSeenMenu(false)
  }

  const totalRated = Object.values(ratings).filter(r => r !== "unseen").length

  if (phase === "analysis") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12" dir="rtl">
        <div className="max-w-xl w-full text-center">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-400 text-sm mb-2">הפרופיל שלך</p>
          <h2 className="text-4xl font-bold mb-4 text-red-400">{personality}</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{description}</p>

          <div className="mb-6 bg-gray-900 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-4 text-right">ה-DNA הקולנועי שלך</p>
            {([
              { key: "realism", labelA: "סטייליש", labelB: "ריאליסטי" },
              { key: "hero",    labelA: "אנטי-גיבור", labelB: "גיבור קלאסי" },
              { key: "pace",    labelA: "אטמוספרי", labelB: "אדרנלין" },
              { key: "ending",  labelA: "טרגי", labelB: "נצחון" },
            ] as const).map(({ key, labelA, labelB }) => {
              const val = dna[key as keyof typeof dna] as number
              const pct = Math.round((val + 1) / 2 * 100)
              return (
                <div key={key} className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{labelB}</span>
                    <span>{labelA}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 relative">
                    <div
                      className="absolute top-0 h-2 w-2 bg-red-400 rounded-full -translate-x-1/2 transition-all"
                      style={{ left: `${pct}%` }}
                    />
                    <div className="absolute top-0 left-1/2 h-2 w-px bg-gray-500" />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {avgGenre.map(g => (
              <div key={g.genre} className="bg-gray-900 rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-1">{GENRE_NAMES[g.genre] || g.genre}</p>
                <p className="text-2xl font-bold text-white">{Math.min(100, Math.round(g.avg / 5 * 100))}%</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-xl p-4 mb-8 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">טריוויה</p>
              <p className="text-2xl font-bold">{triviaScore} / {triviaTotal}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">סרטים דורגו</p>
              <p className="text-2xl font-bold">{totalRated}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">ז'אנר מוביל</p>
              <p className="text-2xl font-bold">{GENRE_NAMES[topGenre] || topGenre}</p>
            </div>
          </div>

          {shareSlug && (
            <div className="mb-6 bg-gray-900 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-2 text-right">הפרופיל הקולנועי שלך 🔗</p>
              <div className="flex gap-2 items-center">
                <span className="flex-1 text-gray-300 text-xs truncate text-left bg-gray-800 rounded-lg px-3 py-2 font-mono">
                  {typeof window !== "undefined" ? `${window.location.host}/profile/${shareSlug}` : `.../${shareSlug}`}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profile/${shareSlug}`)
                    setShareCopied(true)
                    setTimeout(() => setShareCopied(false), 2000)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition whitespace-nowrap"
                >
                  {shareCopied ? "✓ הועתק" : "העתק"}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setPhase("tinder")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-lg transition"
          >
            {unseen.length > 0 ? `בוא נמצא סרטים לצפייה ←` : "סיום"}
          </button>
        </div>
      </main>
    )
  }

  if (phase === "tinder") {
    if (loading) return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center" dir="rtl">
        <p className="text-xl text-gray-400">טוען סרטים...</p>
      </main>
    )

    if (current >= unseen.length) {
      const isEmpty = watchlist.length === 0

      return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4" dir="rtl">
          <div className="text-center max-w-sm w-full">
            {isEmpty || isHeavyWatcher ? (
              <>
                <div className="text-5xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold mb-2">
                  {isHeavyWatcher ? "ראית כמעט הכל..." : "ראית את כל ההמלצות?"}
                </h2>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  {isHeavyWatcher
                    ? "קלטנו שאתה פריק סרטים אמיתי. בוא נחפש עמוק יותר — סרטים חדשים, פחות מוכרים, שאולי עדיין לא הגיעו אליך."
                    : "לא מצאת כלום? בוא נרחיב את החיפוש לסרטים חדשים ופחות מוכרים."}
                </p>
                {loadingMore ? (
                  <p className="text-gray-500 text-sm animate-pulse">
                    {wave === 2 ? "מעמיק את החיפוש..." : wave === 3 ? "מחפש סרטים חדשים (2022+)..." : "מחפש סרטים מ-2024+..."}
                  </p>
                ) : (
                  <button
                    onClick={fetchMoreRecs}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-lg transition mb-4 w-full"
                  >
                    {wave === 1 ? "חפש עמוק יותר ←" : wave === 2 ? "הבא סרטים חדשים (2022+) ←" : "הבא סרטים מ-2024+ ←"}
                  </button>
                )}
                {watchlist.length > 0 && (
                  <button
                    onClick={() => setPhase("watchlist")}
                    className="text-gray-500 text-sm underline"
                  >
                    ראה רשימה ({watchlist.length} סרטים)
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-3xl font-bold mb-4">רשימת הצפייה שלך מוכנה!</h2>
                <p className="text-gray-400 mb-8">שמרת {watchlist.length} סרטים</p>
                <button
                  onClick={() => setPhase("watchlist")}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-lg transition"
                >
                  ראה את הרשימה ←
                </button>
              </>
            )}
          </div>
        </main>
      )
    }

    const movie = unseen[current]

    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4" dir="rtl">
        <div className="max-w-sm w-full">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm">{current + 1} / {unseen.length} — ימינה לשמור, שמאלה לדלג</p>
          </div>

          <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6">
            {movie?.poster && (
              <Image
                src={movie.poster}
                alt={movie.title}
                width={400}
                height={500}
                className="w-full object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-xl">{movie?.title}</h3>
                <span className="text-gray-500 text-sm">{movie?.year}</span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-3">{movie?.overview}</p>
            </div>
          </div>

          <div className="relative">
            {showSeenMenu && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 z-10">
                <button
                  onClick={() => swipeSeen("loved")}
                  className="w-full py-3 px-4 text-right text-sm font-medium hover:bg-gray-700 transition border-b border-gray-700"
                >
                  ❤️ אהבתי
                </button>
                <button
                  onClick={() => swipeSeen("ok")}
                  className="w-full py-3 px-4 text-right text-sm font-medium hover:bg-gray-700 transition border-b border-gray-700"
                >
                  👍 נחמד
                </button>
                <button
                  onClick={() => swipeSeen("disliked")}
                  className="w-full py-3 px-4 text-right text-sm font-medium hover:bg-gray-700 transition"
                >
                  👎 לא אהבתי
                </button>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={swipeLeft}
                className="flex-1 py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 text-2xl transition"
              >
                ✕
              </button>
              <button
                onClick={() => setShowSeenMenu(m => !m)}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold transition ${showSeenMenu ? "bg-blue-600" : "bg-blue-800 hover:bg-blue-700"}`}
              >
                ראיתי ▾
              </button>
              <button
                onClick={swipeRight}
                className="flex-1 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-2xl transition"
              >
                ♥
              </button>
            </div>
            <div className="flex justify-between text-gray-500 text-xs mt-2 px-2">
              <span>דלג</span>
              <span>ראיתי + דירוג</span>
              <span>הוסף לרשימה</span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">רשימת הצפייה שלך</h2>
        <p className="text-gray-400 text-center mb-8">{watchlist.length} סרטים שבחרת</p>

        <div className="space-y-4">
          {watchlist.map(movie => (
            <div key={`${movie.id}-${movie.genre}`} className="flex gap-4 bg-gray-900 rounded-xl p-4">
              {movie.poster && (
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={60}
                  height={90}
                  className="rounded-lg flex-shrink-0"
                />
              )}
              <div>
                <h3 className="font-bold text-lg">{movie.title}</h3>
                <p className="text-gray-500 text-sm mb-1">{movie.year} · {GENRE_NAMES[movie.genre]}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>

        {watchlist.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-5xl mb-4">🎬</p>
            <p>לא שמרת סרטים לרשימה</p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ResultsPageWrapper() {
  return (
    <Suspense>
      <ResultsPage />
    </Suspense>
  )
}
