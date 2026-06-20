import { NextRequest, NextResponse } from "next/server"
import { MOVIES } from "@/lib/movies"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const genres = searchParams.get("genres")?.split(",") || []

  const apiKey = process.env.TMDB_API_KEY
  const seenIds = new Set<number>()
  const filtered = MOVIES.filter(m => {
    if (genres.length > 0 && !genres.includes(m.genre)) return false
    if (seenIds.has(m.id)) return false
    seenIds.add(m.id)
    return true
  })

  const withPosters = await Promise.all(
    filtered.map(async (movie) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=he-IL`
        )
        const result = await res.json()

        if (!result || result.success === false) return { ...movie, poster: null, overview: "", tmdb_score: 0 }

        return {
          ...movie,
          poster: result.poster_path
            ? `https://image.tmdb.org/t/p/w300${result.poster_path}`
            : null,
          overview: result.overview || "",
          tmdb_score: result.vote_average || 0,
        }
      } catch {
        return { ...movie, poster: null, overview: "", tmdb_score: 0 }
      }
    })
  )

  return NextResponse.json(withPosters)
}
