"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const GENRES = [
  { id: "action", name: "פעולה", emoji: "💥" },
  { id: "crime", name: "פשע", emoji: "🔫" },
  { id: "war", name: "מלחמה", emoji: "⚔️" },
  { id: "thriller", name: "מתח", emoji: "😰" },
  { id: "drama", name: "דרמה", emoji: "🎭" },
  { id: "horror", name: "אימה", emoji: "👻" },
  { id: "scifi", name: "מדע בדיוני", emoji: "🚀" },
  { id: "adventure", name: "הרפתקאות", emoji: "🗺️" },
  { id: "fantasy", name: "פנטזיה", emoji: "🧙" },
  { id: "western", name: "מערבון", emoji: "🤠" },
  { id: "history", name: "היסטוריה", emoji: "📜" },
  { id: "comedy", name: "קומדיה", emoji: "😂" },
]

const MAX = 3

export default function Onboarding() {
  const [selected, setSelected] = useState<string[]>([])
  const router = useRouter()

  function toggle(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(g => g !== id)
      if (prev.length >= MAX) return prev
      return [...prev, id]
    })
  }

  function goNext() {
    router.push(`/tinder?genres=${selected.join(",")}`)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12" dir="rtl">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl font-bold mb-2">מה אתה אוהב לצפות?</h2>
        <p className="text-gray-400 mb-2">בחר בדיוק 3 ז'אנרים שהכי מדברים אליך</p>
        <p className="text-red-400 text-sm mb-8">
          {selected.length === MAX ? "✓ בחרת 3 ז'אנרים" : `נבחרו ${selected.length} מתוך 3`}
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
          onClick={goNext}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-12 rounded-full text-lg transition"
        >
          בוא נתחיל ←
        </button>
      </div>
    </main>
  )
}
