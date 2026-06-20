// realism: -1 סטייליש/מוגזם ← → +1 גריטי/ריאליסטי
// hero:    -1 אנטי-גיבור/אפור ← → +1 גיבור קלאסי
// pace:    -1 איטי/אטמוספרי ← → +1 אדרנלין רצוף
// ending:  -1 טרגי/פתוח ← → +1 נצחון/תקווה
export type DNA = { realism: number; hero: number; pace: number; ending: number }

export type Movie = {
  id: number
  title: string
  year: number
  genre: "action" | "crime" | "war"
  tier: "high" | "mid" | "low"
  dna: DNA
}

export const MOVIES: Movie[] = [
  // ===== פעולה =====
  { id: 949,    title: "Heat",               year: 1995, genre: "action", tier: "high", dna: { realism: 0.8,  hero: -0.3, pace: 0.2,  ending: -0.7 } },
  { id: 98,     title: "Gladiator",          year: 2000, genre: "action", tier: "high", dna: { realism: 0.2,  hero: 0.8,  pace: 0.5,  ending: -0.5 } },
  { id: 562,    title: "Die Hard",           year: 1988, genre: "action", tier: "high", dna: { realism: 0.1,  hero: 0.9,  pace: 0.8,  ending: 0.9  } },
  { id: 76341,  title: "Mad Max: Fury Road", year: 2015, genre: "action", tier: "high", dna: { realism: -0.9, hero: 0.3,  pace: 1.0,  ending: 0.4  } },
  { id: 155,    title: "The Dark Knight",    year: 2008, genre: "action", tier: "high", dna: { realism: 0.5,  hero: -0.2, pace: 0.4,  ending: -0.6 } },
  { id: 7485,   title: "Shooter",            year: 2007, genre: "action", tier: "mid",  dna: { realism: 0.5,  hero: 0.7,  pace: 0.6,  ending: 0.7  } },
  { id: 1701,   title: "Con Air",            year: 1997, genre: "action", tier: "mid",  dna: { realism: -0.6, hero: 0.9,  pace: 0.9,  ending: 0.9  } },
  { id: 754,    title: "Face/Off",           year: 1997, genre: "action", tier: "mid",  dna: { realism: -0.7, hero: 0.3,  pace: 0.8,  ending: 0.6  } },
  { id: 10159,  title: "The Rundown",        year: 2003, genre: "action", tier: "mid",  dna: { realism: -0.3, hero: 0.8,  pace: 0.8,  ending: 0.8  } },
  { id: 107846, title: "Escape Plan",        year: 2013, genre: "action", tier: "mid",  dna: { realism: -0.1, hero: 0.7,  pace: 0.5,  ending: 0.8  } },
  { id: 6068,   title: "Hard Target",        year: 1993, genre: "action", tier: "low",  dna: { realism: -0.5, hero: 0.8,  pace: 0.8,  ending: 0.9  } },
  { id: 10861,  title: "Maximum Risk",       year: 1996, genre: "action", tier: "low",  dna: { realism: -0.2, hero: 0.6,  pace: 0.7,  ending: 0.7  } },
  { id: 8975,   title: "The Marine",         year: 2006, genre: "action", tier: "low",  dna: { realism: -0.4, hero: 1.0,  pace: 0.9,  ending: 1.0  } },
  { id: 9405,   title: "Double Team",        year: 1997, genre: "action", tier: "low",  dna: { realism: -0.8, hero: 0.7,  pace: 0.8,  ending: 0.8  } },
  { id: 8470,   title: "Driven",             year: 2001, genre: "action", tier: "low",  dna: { realism: 0.0,  hero: 0.6,  pace: 0.7,  ending: 0.5  } },

  // ===== פשע =====
  { id: 238,    title: "The Godfather",             year: 1972, genre: "crime", tier: "high", dna: { realism: 0.7,  hero: -0.5, pace: -0.7, ending: -0.8 } },
  { id: 769,    title: "GoodFellas",                year: 1990, genre: "crime", tier: "high", dna: { realism: 0.8,  hero: -0.7, pace: 0.3,  ending: -0.3 } },
  { id: 1422,   title: "The Departed",              year: 2006, genre: "crime", tier: "high", dna: { realism: 0.7,  hero: -0.4, pace: 0.4,  ending: -1.0 } },
  { id: 949,    title: "Heat",                      year: 1995, genre: "crime", tier: "high", dna: { realism: 0.8,  hero: -0.3, pace: 0.2,  ending: -0.7 } },
  { id: 311,    title: "Once Upon a Time in America", year: 1984, genre: "crime", tier: "high", dna: { realism: 0.6, hero: -0.5, pace: -0.8, ending: -0.9 } },
  { id: 4147,   title: "Road to Perdition",         year: 2002, genre: "crime", tier: "mid",  dna: { realism: 0.4,  hero: -0.2, pace: -0.4, ending: -0.6 } },
  { id: 379,    title: "Miller's Crossing",          year: 1990, genre: "crime", tier: "mid",  dna: { realism: 0.3,  hero: -0.3, pace: -0.2, ending: -0.4 } },
  { id: 21575,  title: "A Prophet",                 year: 2009, genre: "crime", tier: "mid",  dna: { realism: 0.9,  hero: -0.6, pace: -0.1, ending: 0.1  } },
  { id: 8882,   title: "Gomorrah",                  year: 2008, genre: "crime", tier: "mid",  dna: { realism: 1.0,  hero: -0.8, pace: -0.3, ending: -0.9 } },
  { id: 165213, title: "New World",                 year: 2013, genre: "crime", tier: "mid",  dna: { realism: 0.8,  hero: -0.5, pace: 0.0,  ending: -0.5 } },
  { id: 13389,  title: "Righteous Kill",            year: 2008, genre: "crime", tier: "low",  dna: { realism: 0.3,  hero: 0.2,  pace: 0.4,  ending: -0.3 } },
  { id: 31945,  title: "The Sicilian",              year: 1987, genre: "crime", tier: "low",  dna: { realism: 0.2,  hero: -0.1, pace: -0.2, ending: -0.2 } },
  { id: 21219,  title: "Mobsters",                  year: 1991, genre: "crime", tier: "low",  dna: { realism: -0.1, hero: 0.1,  pace: 0.2,  ending: 0.1  } },
  { id: 82682,  title: "Gangster Squad",            year: 2013, genre: "crime", tier: "low",  dna: { realism: -0.4, hero: 0.6,  pace: 0.6,  ending: 0.8  } },
  { id: 259695, title: "Live by Night",             year: 2016, genre: "crime", tier: "low",  dna: { realism: 0.1,  hero: 0.0,  pace: 0.1,  ending: -0.1 } },

  // ===== פעולה נוספים =====
  { id: 941,    title: "Lethal Weapon",        year: 1987, genre: "action", tier: "high", dna: { realism: 0.3,  hero: 0.8,  pace: 0.7,  ending: 0.9  } },
  { id: 9509,   title: "Man on Fire",          year: 2004, genre: "action", tier: "mid",  dna: { realism: 0.6,  hero: 0.4,  pace: 0.5,  ending: -0.5 } },
  { id: 1538,   title: "Collateral",           year: 2004, genre: "action", tier: "mid",  dna: { realism: 0.7,  hero: -0.3, pace: 0.4,  ending: -0.6 } },
  { id: 156022, title: "The Equalizer",        year: 2014, genre: "action", tier: "mid",  dna: { realism: 0.4,  hero: 0.9,  pace: 0.6,  ending: 0.8  } },

  // ===== פשע נוספים =====
  { id: 273481, title: "Sicario",              year: 2015, genre: "crime", tier: "high", dna: { realism: 0.9,  hero: -0.4, pace: 0.3,  ending: -0.8 } },
  { id: 2034,   title: "Training Day",         year: 2001, genre: "crime", tier: "high", dna: { realism: 0.8,  hero: -0.6, pace: 0.5,  ending: -0.7 } },
  { id: 6977,   title: "No Country for Old Men", year: 2007, genre: "crime", tier: "high", dna: { realism: 0.9, hero: -0.5, pace: -0.2, ending: -1.0 } },
  { id: 4982,   title: "American Gangster",    year: 2007, genre: "crime", tier: "mid",  dna: { realism: 0.7,  hero: -0.3, pace: 0.2,  ending: -0.4 } },

  // ===== מלחמה =====
  { id: 857,    title: "Saving Private Ryan", year: 1998, genre: "war", tier: "high", dna: { realism: 1.0,  hero: 0.6,  pace: 0.5,  ending: -0.4 } },
  { id: 855,    title: "Black Hawk Down",     year: 2001, genre: "war", tier: "high", dna: { realism: 1.0,  hero: 0.5,  pace: 0.9,  ending: -0.6 } },
  { id: 792,    title: "Platoon",             year: 1986, genre: "war", tier: "high", dna: { realism: 0.9,  hero: -0.4, pace: 0.3,  ending: -0.8 } },
  { id: 600,    title: "Full Metal Jacket",   year: 1987, genre: "war", tier: "high", dna: { realism: 0.8,  hero: -0.6, pace: 0.1,  ending: -0.9 } },
  { id: 324786, title: "Hacksaw Ridge",       year: 2016, genre: "war", tier: "high", dna: { realism: 0.8,  hero: 1.0,  pace: 0.5,  ending: 0.9  } },
  { id: 10590,  title: "We Were Soldiers",    year: 2002, genre: "war", tier: "mid",  dna: { realism: 0.8,  hero: 0.7,  pace: 0.7,  ending: -0.3 } },
  { id: 193756, title: "Lone Survivor",       year: 2013, genre: "war", tier: "mid",  dna: { realism: 0.9,  hero: 0.8,  pace: 0.8,  ending: -0.5 } },
  { id: 300671, title: "13 Hours",            year: 2016, genre: "war", tier: "mid",  dna: { realism: 0.9,  hero: 0.7,  pace: 0.8,  ending: -0.2 } },
  { id: 228150, title: "Fury",                year: 2014, genre: "war", tier: "mid",  dna: { realism: 0.8,  hero: 0.1,  pace: 0.5,  ending: -0.7 } },
  { id: 9567,   title: "Tears of the Sun",    year: 2003, genre: "war", tier: "mid",  dna: { realism: 0.5,  hero: 0.8,  pace: 0.5,  ending: 0.5  } },
  { id: 8007,   title: "Behind Enemy Lines",  year: 2001, genre: "war", tier: "low",  dna: { realism: 0.3,  hero: 0.7,  pace: 0.7,  ending: 0.7  } },
  { id: 10048,  title: "Stealth",             year: 2005, genre: "war", tier: "low",  dna: { realism: -0.6, hero: 0.7,  pace: 0.9,  ending: 0.7  } },
  { id: 12100,  title: "Windtalkers",         year: 2002, genre: "war", tier: "low",  dna: { realism: 0.4,  hero: 0.5,  pace: 0.6,  ending: -0.4 } },
  { id: 19086,  title: "Delta Force 2",       year: 1990, genre: "war", tier: "low",  dna: { realism: -0.2, hero: 0.9,  pace: 0.8,  ending: 0.9  } },
  { id: 427910, title: "Navy SEALs",          year: 1990, genre: "war", tier: "low",  dna: { realism: 0.1,  hero: 0.8,  pace: 0.8,  ending: 0.8  } },

  // ===== מלחמה נוספים =====
  { id: 197,    title: "Braveheart",           year: 1995, genre: "war", tier: "high", dna: { realism: 0.2,  hero: 1.0,  pace: 0.5,  ending: -0.6 } },
  { id: 10366,  title: "The Patriot",          year: 2000, genre: "war", tier: "mid",  dna: { realism: 0.2,  hero: 0.9,  pace: 0.5,  ending: 0.5  } },
  { id: 72190,  title: "Act of Valor",         year: 2012, genre: "war", tier: "low",  dna: { realism: 0.8,  hero: 0.8,  pace: 0.8,  ending: 0.3  } },
]

const SCORE: Record<string, number> = { loved_much: 5, loved: 4, ok: 3, disliked: 1, unseen: 0 }

export function buildDNA(ratings: Record<string, string>): DNA & { confidence: number } {
  const axes: DNA = { realism: 0, hero: 0, pace: 0, ending: 0 }
  let totalWeight = 0

  MOVIES.forEach(m => {
    const key = `${m.id}-${m.genre}`
    const rating = ratings[key]
    if (!rating || rating === "unseen") return
    const score = SCORE[rating] ?? 0
    // ממרכז: 3 = ניטרלי, 5 = +1, 1 = -1
    const weight = (score - 3) / 2
    axes.realism += m.dna.realism * weight
    axes.hero    += m.dna.hero    * weight
    axes.pace    += m.dna.pace    * weight
    axes.ending  += m.dna.ending  * weight
    totalWeight  += Math.abs(weight)
  })

  if (totalWeight === 0) return { ...axes, confidence: 0 }

  const norm = (v: number) => Math.max(-1, Math.min(1, v / totalWeight))
  return {
    realism:    norm(axes.realism),
    hero:       norm(axes.hero),
    pace:       norm(axes.pace),
    ending:     norm(axes.ending),
    confidence: Math.min(1, totalWeight / 10),
  }
}

export function dnaToPersonality(dna: DNA): { title: string; description: string } {
  const { realism, hero, pace, ending } = dna

  if (realism > 0.4 && hero < -0.2 && ending < -0.2)
    return { title: "הצופה הציני", description: "אתה רוצה אמת, לא נחמה. סרטים שלא פוחדים לסיים בכאב — זה מה שמדבר אליך." }

  if (realism > 0.4 && hero > 0.3)
    return { title: "גיבור ריאליסטי", description: "אתה אוהב גיבורים — אבל כאלה שנלחמים בעולם אמיתי, לא על בגדי סופרמן." }

  if (pace > 0.5 && hero > 0.5 && ending > 0.3)
    return { title: "אדרנלין טהור", description: "עבורך קולנוע = דופק גבוה. גיבור ברור, טמפו מטורף, והסוף חייב לספק." }

  if (realism < -0.3 && pace > 0.4)
    return { title: "מאהב הספקטקל", description: "הסגנון הוא התוכן. אתה רוצה לראות משהו שאי-אפשר לראות בחיים האמיתיים." }

  if (pace < -0.2 && realism > 0.3)
    return { title: "צופה עמוק", description: "אתה נותן לסרט לבנות. עולם אטמוספרי, דמויות מורכבות — לא בורח מקצב איטי." }

  return { title: "אקלקטי מושכל", description: "אין לך תבנית אחת — אתה מגיב לאיכות, לא לז'אנר. זה סימן של צופה בשל." }
}

export const GENRE_NAMES: Record<string, string> = {
  action: "פעולה",
  crime: "פשע",
  war: "מלחמה",
}

export const TRIVIA = [
  {
    movie: "Black Hawk Down",
    question: "Black Hawk Down — האם הסרט מבוסס על אירוע אמיתי?",
    answers: ["כן, קרב מוגדישו 1993", "לא, זה סיפור בדיוני", "מבוסס חלקית על אירועים", "מבוסס על משחק מלחמה"],
    correct: 0,
    fact: "הקרב התרחש באוקטובר 1993 בסומליה — 18 חיילים אמריקאים נהרגו ביממה אחת.",
  },
  {
    movie: "The Godfather",
    question: "The Godfather — מה קורה לסוס הגזעי של נבל הסרט?",
    answers: ["הוא נמכר", "הוא בורח", "הוא מוצא מת במיטה", "הוא נגנב"],
    correct: 2,
    fact: "הסוס Khartoum נמצא מת — הראש בלבד — במיטה של ג'ק וולץ. אחת הסצנות המפורסמות בקולנוע.",
  },
  {
    movie: "GoodFellas",
    question: "GoodFellas — מה עושה Tommy DeVito (ג'ו פשי) ממש לפני שהוא נרצח?",
    answers: ["מנסה לברוח", "חושב שהוא מקבל תפקיד בכיר", "מתחתן", "מסגיר חבר"],
    correct: 1,
    fact: "Tommy חשב שהולכים לעשות אותו 'made man' — במקום זה ירו לו בראש. אף פעם לא ראה את זה בא.",
  },
  {
    movie: "Saving Private Ryan",
    question: "Saving Private Ryan — למה כל כך חשוב למצוא את ריאן?",
    answers: ["הוא מרגל", "שלושת אחיו נהרגו באותה שבוע", "הוא בן יחיד", "הוא שבוי מלחמה"],
    correct: 1,
    fact: "שלושת אחיו של ריאן נהרגו באותו שבוע — הממשל לא רצה לשלוח גם אותו הביתה במגן.",
  },
  {
    movie: "Heat",
    question: "Heat — מה קורה לניל מקוליי (דה נירו) בסוף הסרט?",
    answers: ["נכנס לכלא", "נמלט למקסיקו", "נהרג על ידי וינסנט הנה", "נעצר ומשתף פעולה"],
    correct: 2,
    fact: "ניל חוזר להרוג אחד אחרון — וזה עולה לו בחיים. וינסנט (אל פאצ'ינו) יורה בו על קרקע שדה התעופה.",
  },
  {
    movie: "The Dark Knight",
    question: "The Dark Knight — איך הג'וקר מסביר את הצלקות שלו?",
    answers: ["תמיד אותו הסבר", "לא מספר לאף אחד", "כל פעם סיפור אחר", "אמר רק לבאטמן"],
    correct: 2,
    fact: "הג'וקר משנה את הסיפור בכל פעם — פעם האב שלו, פעם אישתו. הוא לא רוצה שתבינו אותו.",
  },
  {
    movie: "Platoon",
    question: "Platoon — מה עושה הסרג'נט בארנס (טום ברנגר) שהופך אותו לנבל?",
    answers: ["עוזב חיילים פצועים", "הורג כפרייה בדם קר", "מסגיר מידע לאויב", "גונב מהחיילים"],
    correct: 1,
    fact: "בארנס יורה בכפרייה וייטנאמית בקרב — סצנה שאוליבר סטון אמר שהיא מבוססת על דברים שראה בעצמו.",
  },
  {
    movie: "Hacksaw Ridge",
    question: "Hacksaw Ridge — האם זה סיפור אמיתי?",
    answers: ["כן, דסמונד דוס היה אדם אמיתי", "לא, זה מבוסס על רומן", "חלקית — הקרב אמיתי, הגיבור לא", "השם אמיתי, הסיפור בדיוני"],
    correct: 0,
    fact: "דסמונד דוס היה הטבע הרפואי הראשון שזכה במדליית הכבוד — בלי לשאת נשק, הציל 75 פצועים בלבד.",
  },
  {
    movie: "The Departed",
    question: "The Departed — מה קורה לכמעט כל הדמויות הראשיות בסוף?",
    answers: ["נכנסות לכלא", "נהרגות", "מסתתרות", "מצליחות להימלט"],
    correct: 1,
    fact: "סקורסזה לא חסך — כמעט כולם מתים. סצנת הסוף במעלית היא אחת האכזריות בקולנוע של המאה ה-21.",
  },
  {
    movie: "Fury",
    question: "Fury — מה שם הטנק שסביבו מתרחש הסרט?",
    answers: ["Iron Fist", "Fury", "Death Machine", "Sherman"],
    correct: 1,
    fact: "הטנק 'Fury' הוא Sherman M4A3E8 — הצוות ישן, אוכל ולוחם בתוכו לאורך כל המלחמה.",
  },
  {
    movie: "Face/Off",
    question: "Face/Off — מה הרעיון המרכזי של הסרט?",
    answers: ["שני אחים תאומים מחליפים זהות", "בלש ונבל מחליפים פנים בניתוח", "שוטר מתחזה לפושע", "פושע מתחפש לשוטר"],
    correct: 1,
    fact: "ג'ון ווו לקח רעיון מטורף לגמרי — ניקולס קייג' וג'ון טרבולטה מחליפים פנים ממש — ועשה ממנו קלאסיק.",
  },
  {
    movie: "Lone Survivor",
    question: "Lone Survivor — מי ניצל בפועל מהמשימה?",
    answers: ["כל הצוות", "שניים מארבעה", "רק מרקוס לאטרל", "אף אחד"],
    correct: 2,
    fact: "מרקוס לאטרל היה החייל היחיד ששרד — הוא כתב את הספר שעליו מבוסס הסרט.",
  },
]
