"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const GENRES = [
  { id: "action",    name: "פעולה",       emoji: "💥" },
  { id: "crime",     name: "פשע",         emoji: "🔫" },
  { id: "war",       name: "מלחמה",       emoji: "⚔️" },
  { id: "thriller",  name: "מתח",         emoji: "😰" },
  { id: "drama",     name: "דרמה",        emoji: "🎭" },
  { id: "horror",    name: "אימה",        emoji: "👻" },
  { id: "scifi",     name: "מדע בדיוני",  emoji: "🚀" },
  { id: "adventure", name: "הרפתקאות",   emoji: "🗺️" },
  { id: "fantasy",   name: "פנטזיה",      emoji: "🧙" },
  { id: "western",   name: "מערבון",      emoji: "🤠" },
  { id: "history",   name: "היסטוריה",    emoji: "📜" },
  { id: "comedy",    name: "קומדיה",      emoji: "😂" },
]

const MAX = 3

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<"info" | "genres">("info")
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState("")

  function handleInfoNext() {
    if (!name.trim() || !gender || !age) {
      setError("יש למלא את כל השדות")
      return
    }
    setError("")
    setStep("genres")
  }

  function toggle(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(g => g !== id)
      if (prev.length >= MAX) return prev
      return [...prev, id]
    })
  }

  function handleStart() {
    const params = new URLSearchParams({ name: name.trim(), gender, age, genres: selected.join(",") })
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
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12" dir="rtl">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">מה אתה אוהב לצפות?</h2>
        <p className="text-gray-400 mb-2">בחר בדיוק 3 ז׳אנרים שהכי מדברים אליך</p>
        <p className="text-red-400 text-sm mb-8">
          {selected.length === MAX ? "✓ בחרת 3 ז׳אנרים" : `נבחרו ${selected.length} מתוך 3`}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {GENRES.map(g => {
            const isSelected = selected.includes(g.id)
            const isDisabled = !isSelected && selected.length >= MAX
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                disabled={isDisabled}
                className={`py-4 px-2 rounded-xl text-lg font-medium transition border-2 ${
                  isSelected
                    ? "border-red-500 bg-red-500/20 text-white"
                    : isDisabled
                    ? "border-gray-800 bg-gray-900/50 text-gray-600 cursor-not-allowed"
                    : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="text-3xl mb-1">{g.emoji}</div>
                {g.name}
              </button>
            )
          })}
        </div>

        <button
          disabled={selected.length !== MAX}
          onClick={handleStart}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-full text-lg transition"
        >
          בוא נתחיל ←
        </button>
      </div>
    </main>
  )
}
