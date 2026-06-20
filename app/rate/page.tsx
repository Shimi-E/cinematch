"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { TRIVIA } from "@/lib/movies"

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

const RATINGS = ["מעולה", "טוב", "אפשרי", "גרוע", "לא ראיתי"]
const RATING_COLORS: Record<string, string> = {
  "מעולה": "bg-green-600 border-green-400",
  "טוב": "bg-blue-600 border-blue-400",
  "אפשרי": "bg-yellow-600 border-yellow-400",
  "גרוע": "bg-red-700 border-red-400",
  "לא ראיתי": "bg-gray-700 border-gray-500",
}

const BATCH = 5

function RatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const genres = searchParams.get("genres") || ""

  const [movies, setMovies] = useState<MovieWithPoster[]>([])
  const [ratings, setRatings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [batchStart, setBatchStart] = useState(0)
  const [showTrivia, setShowTrivia] = useState(false)
  const [triviaIndex, setTriviaIndex] = useState(0)
  const [triviaAnswer, setTriviaAnswer] = useState<number | null>(null)
  const [triviaScore, setTriviaScore] = useState(0)

  useEffect(() => {
    fetch(`/api/movies?genres=${genres}`)
      .then(r => r.json())
      .then(data => { setMovies(data); setLoading(false) })
  }, [genres])

  const total = movies.length
  const rated = Object.keys(ratings).length
  const progress = total > 0 ? Math.round((rated / total) * 100) : 0
  const currentBatch = movies.slice(batchStart, batchStart + BATCH)
  const batchRated = currentBatch.filter(m => ratings[`${m.id}-${m.genre}`]).length
  const batchComplete = batchRated === currentBatch.length && currentBatch.length > 0

  function rate(movie: MovieWithPoster, rating: string) {
    setRatings(prev => ({ ...prev, [`${movie.id}-${movie.genre}`]: rating }))
  }

  function nextBatch() {
    if (batchStart + BATCH < total) {
      setShowTrivia(true)
      setTriviaAnswer(null)
    }
  }

  function answerTrivia(idx: number) {
    setTriviaAnswer(idx)
    const trivia = TRIVIA[triviaIndex % TRIVIA.length]
    if (idx === trivia.correct) setTriviaScore(s => s + 1)
  }

  function continueAfterTrivia() {
    setBatchStart(b => b + BATCH)
    setTriviaIndex(i => i + 1)
    setShowTrivia(false)
  }

  function finish() {
    const encoded = encodeURIComponent(JSON.stringify(ratings))
    router.push(`/results?ratings=${encoded}&trivia=${triviaScore}`)
  }

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-5xl mb-4">🎬</div>
        <p className="text-2xl text-gray-400">טוען סרטים...</p>
      </div>
    </main>
  )

  if (showTrivia) {
    const trivia = TRIVIA[triviaIndex % TRIVIA.length]
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-lg w-full bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-2">🎬</div>
          <p className="text-yellow-400 font-bold text-sm mb-3">שאלת טריוויה</p>
          <h3 className="text-xl font-bold mb-6">{trivia.question}</h3>
          <div className="space-y-3 mb-6">
            {trivia.answers.map((ans, idx) => (
              <button
                key={idx}
                onClick={() => answerTrivia(idx)}
                disabled={triviaAnswer !== null}
                className={`w-full py-3 px-4 rounded-xl text-right font-medium transition border-2 ${
                  triviaAnswer === null
                    ? "border-gray-700 bg-gray-800 hover:border-gray-500"
                    : idx === trivia.correct
                    ? "border-green-400 bg-green-900 text-green-300"
                    : idx === triviaAnswer
                    ? "border-red-400 bg-red-900 text-red-300"
                    : "border-gray-700 bg-gray-800 opacity-40"
                }`}
              >
                {ans}
              </button>
            ))}
          </div>
          {triviaAnswer !== null && (
            <button
              onClick={continueAfterTrivia}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full transition"
            >
              המשך ←
            </button>
          )}
          <p className="text-gray-500 text-sm mt-4">ציון טריוויה: {triviaScore} / {triviaIndex + 1}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-10" dir="rtl">
      <div className="max-w-3xl mx-auto">

        <div className="sticky top-0 bg-black py-4 z-10 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">דרג את הסרטים</h2>
            <span className="text-gray-400 text-sm">{rated} / {total}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {currentBatch.map(movie => (
            <div
              key={`${movie.id}-${movie.genre}`}
              className="flex gap-4 bg-gray-900 rounded-xl p-4 items-start"
            >
              <div className="flex-shrink-0">
                {movie.poster ? (
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    width={80}
                    height={120}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gray-800 rounded-lg flex items-center justify-center text-3xl">🎬</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-base">{movie.title}</h3>
                  <span className="text-gray-500 text-xs">{movie.year}</span>
                </div>
                {movie.overview && (
                  <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{movie.overview}</p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {RATINGS.map(r => (
                    <button
                      key={r}
                      onClick={() => rate(movie, r)}
                      className={`text-xs font-medium py-1.5 px-3 rounded-full text-white transition border ${
                        ratings[`${movie.id}-${movie.genre}`] === r
                          ? RATING_COLORS[r]
                          : "border-gray-700 bg-gray-800 hover:border-gray-500"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          {batchStart + BATCH < total ? (
            <button
              disabled={!batchComplete}
              onClick={nextBatch}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-full text-lg transition"
            >
              הבא — שאלת טריוויה ←
            </button>
          ) : batchComplete ? (
            <button
              onClick={finish}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-lg transition"
            >
              קבל המלצות מותאמות אישית ←
            </button>
          ) : null}
        </div>

      </div>
    </main>
  )
}

export default function RatePageWrapper() {
  return (
    <Suspense>
      <RatePage />
    </Suspense>
  )
}
