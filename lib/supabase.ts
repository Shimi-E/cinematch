import { createClient } from "@supabase/supabase-js"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function saveProfile(data: {
  personality: string
  dna: Record<string, number>
  topGenre: string
  ratings: Record<string, string>
  triviaScore: number
  totalRated: number
  name?: string
  gender?: string
  age?: number
}): Promise<string | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const slug = Math.random().toString(36).slice(2, 8)

  const { error } = await supabase.from("profiles").insert({
    slug,
    personality: data.personality,
    dna: data.dna,
    top_genre: data.topGenre,
    ratings: data.ratings,
    trivia_score: data.triviaScore,
    total_rated: data.totalRated,
    name: data.name || null,
    gender: data.gender || null,
    age: data.age || null,
  })

  if (error) {
    console.error("Supabase error:", error)
    return null
  }

  return slug
}
