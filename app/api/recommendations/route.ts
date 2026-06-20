import { NextRequest, NextResponse } from "next/server"
import { MOVIES, buildDNA } from "@/lib/movies"

const SCORE: Record<string, number> = { loved_much: 5, loved: 4, ok: 3, disliked: 1 }
const EXCLUDE_GENRES = new Set([16, 10751, 10402]) // אנימציה, משפחה, מוזיקלי

type TmdbMovie = {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  overview: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

async function getSimilar(apiKey: string, movieId: number, page = 1): Promise<TmdbMovie[]> {
  const r = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=he-IL&page=${page}`
  )
  const d = await r.json()
  return (d.results || []) as TmdbMovie[]
}

export async function POST(request: NextRequest) {
  const { ratings, wave = 1 } = await request.json()
  const apiKey = process.env.TMDB_API_KEY!
  const isDeep = wave >= 2

  const dna = buildDNA(ratings)

  // כל הסרטים שהמשתמש ראה — לא להמליץ עליהם
  const seenIds = new Set([
    ...Object.keys(ratings).map(k => k.split("-")[0]),
    ...MOVIES.map(m => String(m.id)),
  ])

  // מצא את הסרטים שהכי אהב — הם "הזרע" להמלצות
  const lovedMovies = MOVIES
    .map(m => {
      const key = `${m.id}-${m.genre}`
      const rating = ratings[key]
      return { movie: m, score: SCORE[rating] || 0 }
    })
    .filter(x => x.score >= 4) // loved או loved_much
    .sort((a, b) => b.score - a.score)

  // הסר כפילויות לפי ID (כי Heat מופיע פעמיים)
  const uniqueLoved: typeof lovedMovies = []
  const seenLovedIds = new Set<number>()
  for (const x of lovedMovies) {
    if (!seenLovedIds.has(x.movie.id)) {
      uniqueLoved.push(x)
      seenLovedIds.add(x.movie.id)
    }
  }

  // deep mode — קח גם "ok" כזרעים, ודפים נוספים
  const minScore = isDeep ? 3 : 4
  const lovedMoviesDeep = MOVIES
    .map(m => ({ movie: m, score: SCORE[ratings[`${m.id}-${m.genre}`]] || 0 }))
    .filter(x => x.score >= minScore)
    .sort((a, b) => b.score - a.score)

  const uniqueLovedDeep: typeof lovedMoviesDeep = []
  const seenLovedIdsDeep = new Set<number>()
  for (const x of (isDeep ? lovedMoviesDeep : lovedMovies)) {
    if (!seenLovedIdsDeep.has(x.movie.id)) {
      uniqueLovedDeep.push(x)
      seenLovedIdsDeep.add(x.movie.id)
    }
  }

  // כמה זרעים ודפים לפי גל
  const seedCount = wave === 1 ? 8 : wave === 2 ? 12 : 16
  const pagesPerSeed = wave >= 3 ? 3 : wave === 2 ? 2 : 1

  // קח עד N סרטים שאהב — שלח כל אחד ל-TMDB /recommendations
  const seeds = uniqueLovedDeep.slice(0, seedCount)

  // fallback — אם לא אהב שום דבר, קח את הכי פופולריים מהסרטים שראה
  const fallbackSeeds = seeds.length > 0 ? seeds : MOVIES
    .filter(m => ratings[`${m.id}-${m.genre}`] && ratings[`${m.id}-${m.genre}`] !== "unseen")
    .slice(0, 5)
    .map(m => ({ movie: m, score: 3 }))

  const finalSeeds = seeds.length > 0 ? seeds : fallbackSeeds

  // שלוף המלצות לכל סרט זרע במקביל
  const pages = Array.from({ length: pagesPerSeed }, (_, i) => i + 1)
  const batches = await Promise.all(
    finalSeeds.flatMap(x => pages.map(p => getSimilar(apiKey, x.movie.id, p)))
  )

  // ספור כמה פעמים כל סרט הופיע (חפיפה בין זרעים = סיגנל חזק)
  const countMap = new Map<number, { movie: TmdbMovie; count: number; seedScore: number }>()
  batches.forEach((batch, i) => {
    const seedIndex = Math.floor(i / pagesPerSeed)
    const seedScore = finalSeeds[seedIndex]?.score ?? 3
    batch.forEach(m => {
      if (seenIds.has(String(m.id))) return
      if (m.genre_ids?.some(g => EXCLUDE_GENRES.has(g))) return
      if (!m.vote_count || m.vote_count < 200) return

      const existing = countMap.get(m.id)
      if (existing) {
        existing.count++
        existing.seedScore = Math.max(existing.seedScore, seedScore)
      } else {
        countMap.set(m.id, { movie: m, count: 1, seedScore })
      }
    })
  })

  // מיון: חפיפה גבוהה + ציון seed גבוה + vote_average
  // ריאליסטי → העדף vote_average, pace → העדף פופולריות
  const sorted = Array.from(countMap.values()).sort((a, b) => {
    const realismWeight = dna.realism > 0.3 ? 0.5 : 0.2
    const popularityWeight = dna.pace > 0.4 ? 0.3 : 0.1

    const scoreA =
      a.count * 3 +
      a.seedScore * 2 +
      a.movie.vote_average * realismWeight +
      (a.movie.vote_count / 50000) * popularityWeight

    const scoreB =
      b.count * 3 +
      b.seedScore * 2 +
      b.movie.vote_average * realismWeight +
      (b.movie.vote_count / 50000) * popularityWeight

    return scoreB - scoreA
  })

  // גל 3+ — מוסיף סרטים חדשים מ-TMDB discover (2022+)
  // גל 4+ — מוסיף סרטים מ-2024+
  if (wave >= 3) {
    const TMDB_GENRE: Record<string, number> = { action: 28, crime: 80, war: 10752 }
    const topGenres = Object.entries(
      MOVIES.reduce((acc, m) => {
        const s = SCORE[ratings[`${m.id}-${m.genre}`]] || 0
        if (s >= 4) { acc[m.genre] = (acc[m.genre] || 0) + s }
        return acc
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([g]) => g)

    const genreIds = topGenres.map(g => TMDB_GENRE[g]).filter(Boolean).join(",")
    const fromYear = wave >= 4 ? "2024" : "2022"
    const exclude = "without_keywords=9717,9672&without_genres=16,10751,10402"

    const freshPages = await Promise.all([
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds}&sort_by=popularity.desc&primary_release_date.gte=${fromYear}-01-01&vote_count.gte=100&language=he-IL&${exclude}`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds}&sort_by=vote_average.desc&primary_release_date.gte=${fromYear}-01-01&vote_count.gte=200&language=he-IL&${exclude}`).then(r => r.json()),
    ])

    freshPages.forEach(d => {
      (d.results || []).forEach((m: TmdbMovie) => {
        if (seenIds.has(String(m.id))) return
        if (m.genre_ids?.some((g: number) => EXCLUDE_GENRES.has(g))) return
        if (!countMap.has(m.id)) {
          countMap.set(m.id, { movie: m, count: 1, seedScore: 3 })
        }
      })
    })
  }

  const recommendations = sorted.slice(0, 20).map(({ movie: m }) => ({
    id: m.id,
    title: m.title,
    year: m.release_date?.slice(0, 4),
    poster: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : null,
    overview: m.overview,
    tmdb_score: m.vote_average,
  }))

  // כמה מהסרטים שהמלצנו כבר ראה — אינדיקטור "פריק"
  const totalCandidates = countMap.size + recommendations.length
  const seenRatio = totalCandidates > 0 ? 1 - recommendations.length / (totalCandidates || 1) : 0

  return NextResponse.json({
    recommendations,
    seeds: finalSeeds.map(x => x.movie.title),
    dna,
    seenRatio,
  })
}
