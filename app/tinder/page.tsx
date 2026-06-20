"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { TRIVIA } from "@/lib/movies"

type Movie = {
  id: number
  title: string
  year: string
  genre: string
  tier: string
  poster: string | null
  overview: string
  tmdb_score: number
}

type SwipeResult = "loved_much" | "loved" | "ok" | "disliked" | "unseen"

function TinderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const genres = searchParams.get("genres") || ""
  const userName = searchParams.get("name") || ""
  const userGender = searchParams.get("gender") || ""
  const userAge = searchParams.get("age") || ""

  const [movies, setMovies] = useState<Movie[]>([])
  const [current, setCurrent] = useState(0)
  const [results, setResults] = useState<Record<string, SwipeResult>>({})
  const [loading, setLoading] = useState(true)
  const [showTrivia, setShowTrivia] = useState(false)
  const [triviaIndex, setTriviaIndex] = useState(0)
  const [triviaAnswer, setTriviaAnswer] = useState<number | null>(null)
  const [triviaScore, setTriviaScore] = useState(0)

  useEffect(() => {
    fetch(`/api/movies?genres=${genres}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMovies(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [genres])

  const total = movies.length
  const progress = total > 0 ? Math.round((current / total) * 100) : 0

  function swipe(result: SwipeResult) {
    const movie = movies[current]
    const key = `${movie.id}-${movie.genre}`
    const newResults = { ...results, [key]: result }
    setResults(newResults)

    const next = current + 1
    if (next >= total) {
      const encoded = encodeURIComponent(JSON.stringify(newResults))
      const userParams = new URLSearchParams({ name: userName, gender: userGender, age: userAge }).toString()
      router.push(`/results?ratings=${encoded}&trivia=${triviaScore}&triviaTotal=${triviaIndex}&${userParams}`)
    } else if (next % 10 === 0) {
      setCurrent(next)
      setShowTrivia(true)
      setTriviaAnswer(null)
    } else {
      setCurrent(next)
    }
  }

  function answerTrivia(idx: number) {
    setTriviaAnswer(idx)
    const trivia = TRIVIA[triviaIndex % TRIVIA.length]
    if (idx === trivia.correct) setTriviaScore(s => s + 1)
  }

  function continueAfterTrivia() {
    setTriviaIndex(i => i + 1)
    setShowTrivia(false)
    setCurrent(c => c + 1)
  }

  if (loading) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-5xl mb-4">🎬</div>
        <p className="text-xl text-gray-400">טוען סרטים...</p>
      </div>
    </main>
  )

  if (showTrivia) {
    const trivia = TRIVIA[triviaIndex % TRIVIA.length]
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-lg w-full bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-2">🎬</div>
          <p className="text-yellow-400 font-bold text-sm mb-1">טריוויה</p>
          <p className="text-gray-500 text-xs mb-3">{trivia.movie}</p>
          <h3 className="text-lg font-bold mb-5">{trivia.question}</h3>
          <div className="space-y-2 mb-4">
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
            <div className="mb-5">
              <p className="text-gray-400 text-sm leading-relaxed bg-gray-800 rounded-xl p-3 text-right">
                💡 {trivia.fact}
              </p>
            </div>
          )}
          {triviaAnswer !== null && (
            <button
              onClick={continueAfterTrivia}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-full transition"
            >
              המשך ←
            </button>
          )}
        </div>
      </main>
    )
  }

  if (movies.length === 0) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="text-5xl mb-4">😅</div>
        <p className="text-xl text-gray-400">לא נמצאו סרטים</p>
      </div>
    </main>
  )

  const movie = movies[current]
  if (!movie) return null

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-6" dir="rtl">
      <div className="w-full max-w-sm">

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>סרט {current + 1} מתוך {total}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl overflow-hidden mb-4">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              width={400}
              height={550}
              className="w-full object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-gray-800 flex items-center justify-center text-6xl">🎬</div>
          )}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-xl flex-1">{movie.title}</h3>
              <span className="text-gray-500 text-sm mr-2">{movie.year}</span>
            </div>
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{movie.overview}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => swipe("loved_much")}
            className="flex-1 py-3 rounded-2xl bg-pink-700 hover:bg-pink-600 transition flex flex-col items-center gap-1"
          >
            <span className="text-xl">❤️❤️</span>
            <span className="text-xs text-white font-medium">אהבתי מאוד</span>
          </button>
          <button
            onClick={() => swipe("loved")}
            className="flex-1 py-3 rounded-2xl bg-green-700 hover:bg-green-600 transition flex flex-col items-center gap-1"
          >
            <span className="text-xl">❤️</span>
            <span className="text-xs text-white font-medium">אהבתי</span>
          </button>
          <button
            onClick={() => swipe("ok")}
            className="flex-1 py-3 rounded-2xl bg-yellow-700 hover:bg-yellow-600 transition flex flex-col items-center gap-1"
          >
            <span className="text-xl">👍</span>
            <span className="text-xs text-white font-medium">סבבה</span>
          </button>
          <button
            onClick={() => swipe("disliked")}
            className="flex-1 py-3 rounded-2xl bg-orange-800 hover:bg-orange-700 transition flex flex-col items-center gap-1"
          >
            <span className="text-xl">👎</span>
            <span className="text-xs text-white font-medium">לא אהבתי</span>
          </button>
          <button
            onClick={() => swipe("unseen")}
            className="flex-1 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 transition flex flex-col items-center gap-1"
          >
            <span className="text-xl">👁</span>
            <span className="text-xs text-gray-300 font-medium">לא ראיתי</span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default function TinderPageWrapper() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-xl text-gray-400">טוען...</p>
        </div>
      </main>
    }>
      <TinderPage />
    </Suspense>
  )
}
