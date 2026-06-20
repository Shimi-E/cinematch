import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">
          🎬 Cine<span className="text-red-500">Match</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          המלצות סרטים שמתאימות לך — לא לכולם
        </p>
        <Link href="/onboarding">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full text-lg transition">
            בוא נתחיל
          </button>
        </Link>
      </div>
    </main>
  )
}
