"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [gender, setGender] = useState("")
  const [age, setAge] = useState("")
  const [error, setError] = useState("")

  function handleStart() {
    if (!name.trim() || !gender || !age) {
      setError("יש למלא את כל השדות")
      return
    }
    const params = new URLSearchParams({ name: name.trim(), gender, age })
    router.push(`/tinder?${params.toString()}`)
  }

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
                    gender === opt.val
                      ? "bg-red-600 text-white"
                      : "bg-gray-900 text-gray-400 hover:bg-gray-800"
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
            onClick={handleStart}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full text-lg transition mt-2"
          >
            בוא נתחיל ←
          </button>
        </div>
      </div>
    </main>
  )
}
