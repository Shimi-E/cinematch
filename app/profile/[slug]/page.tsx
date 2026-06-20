import { createClient } from "@supabase/supabase-js"
import { GENRE_NAMES, dnaToPersonality } from "@/lib/movies"
import { notFound } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await supabase.from("profiles").select("*").eq("slug", slug).single()

  if (!data) notFound()

  const dna = data.dna as Record<string, number>
  const { title: personality, description } = dnaToPersonality(dna)

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12" dir="rtl">
      <div className="max-w-xl w-full text-center">
        <div className="text-5xl mb-3">🎬</div>
        <p className="text-gray-500 text-sm mb-1">הפרופיל הקולנועי של</p>
        <p className="text-gray-400 text-sm mb-4">CineMatch</p>
        <h2 className="text-4xl font-bold mb-4 text-red-400">{personality}</h2>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">{description}</p>

        <div className="mb-6 bg-gray-900 rounded-2xl p-5">
          <p className="text-gray-400 text-xs mb-4 text-right">DNA קולנועי</p>
          {([
            { key: "realism", labelA: "סטייליש", labelB: "ריאליסטי" },
            { key: "hero",    labelA: "אנטי-גיבור", labelB: "גיבור קלאסי" },
            { key: "pace",    labelA: "אטמוספרי", labelB: "אדרנלין" },
            { key: "ending",  labelA: "טרגי", labelB: "נצחון" },
          ] as const).map(({ key, labelA, labelB }) => {
            const val = (dna[key] ?? 0) as number
            const pct = Math.round((val + 1) / 2 * 100)
            return (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{labelB}</span>
                  <span>{labelA}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 relative">
                  <div
                    className="absolute top-0 h-2 w-2 bg-red-400 rounded-full -translate-x-1/2"
                    style={{ left: `${pct}%` }}
                  />
                  <div className="absolute top-0 left-1/2 h-2 w-px bg-gray-500" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-900 rounded-xl p-4 mb-8 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">ז׳אנר מוביל</p>
            <p className="text-xl font-bold">{GENRE_NAMES[data.top_genre] || data.top_genre}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">סרטים דורגו</p>
            <p className="text-xl font-bold">{data.total_rated}</p>
          </div>
        </div>

        <a
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full text-lg transition inline-block"
        >
          גלה את הפרופיל שלך ←
        </a>
      </div>
    </main>
  )
}
