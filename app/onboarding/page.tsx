"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const GENRES = [
  { id: "action",  label: "אקשן",    emoji: "💥" },
  { id: "crime",   label: "פשע",     emoji: "🔫" },
  { id: "war",     label: "מלחמה",   emoji: "🪖" },
  { id: "drama",   label: "דרמה",    emoji: "🎭" },
  { id: "thriller",label: "מתח",     emoji: "😰" },
  { id: "scifi",   label: "מדע בדיוני", emoji: "🚀" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<"info" | "genres">("info")
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [error, setError] = useState("")

  function handleInfoNext() {
    if (!name.trim() || !gender || !age) {
      setError("יש למלא את כל השדות")
      return
    }
    setError("")
    setStep("genres")
  }

  function toggleGenre(id: string) {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  function handleStart() {
    const genres = selectedGenres.length > 0 ? selectedGenres.join(",") : ""
    const params = new URLSearchParams({ name: name.trim(), gender, age, genres })
    router.push(`/tinder?${params.toString()}`)
  }

  if (step === "info") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4" dir="rtl">
        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Cine<span className="text-red-500">Match</span>
            </h1>
            <p className="text-gray-400">לפני שנתחיל, ספר לנו קצת עליך</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">שם</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="מה שמך?"
                className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">מין</label>
              <div className="flex gap-3">
                {[{ val: "male", label: "זכר" }, { val: "female", label: "נקבה" }, { val: "other", label: "אחר" }].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setGender(opt.val)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
                      gender === opt.val ? "bg-red-600 text-white" : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">גיל</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="כמה אתה בן/בת?"
                min="10"
                max="99"
                className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-600"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              onClick={handleInfoNext}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full text-lg transition mt-2"
            >
              המשך ←
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4" dir="rtl">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Cine<span className="text-red-500">Match</span>
          </h1>
          <p className="text-gray-400 mb-1">היי {name}! אילו ז׳אנרים אתה אוהב?</p>
          <p className="text-gray-600 text-sm">בחר אחד או יותר (לא חובה)</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => toggleGenre(g.id)}
              className={`py-4 rounded-2xl text-sm font-medium transition flex flex-col items-center gap-1 ${
                selectedGenres.includes(g.id)
                  ? "bg-red-600 text-white"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800"
              }`}
            >
              <span className="text-2xl">{g.emoji}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full text-lg transition"
        >
          {selectedGenres.length > 0 ? "בוא נתחיל ←" : "כל הז׳אנרים ←"}
        </button>
      </div>
    </main>
  )
}
