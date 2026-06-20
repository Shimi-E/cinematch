import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  const data = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ slug })
}
