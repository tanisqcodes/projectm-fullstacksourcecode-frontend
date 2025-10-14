

import { useMemo, useState } from "react"
import {useNavigate}  from "react-router-dom"

export const ChaptersPage =() =>  {
    const navigate = useNavigate()
  // State you can populate later via your API
  const [numberOfChapters, setNumberOfChapters] = useState("15")
  const [chaptersData, setChaptersData] = useState([{
    "id": 1,
    "name": "dummy chapter",
    "questionCount": 0,
    "tag": "nothing"
  },
  {
    "id": 2,
    "name": "Linear Equations",
    "questionCount": "20",
    "tag": "Algebra"
  },
  {
    "id": 3,
    "name": "Systems of Linear Equations",
    "questionCount": "15",
    "tag": "Algebra"
  },
  {
    "id": 4,
    "name": "Inequalities",
    "questionCount": "12",
    "tag": "Algebra"
  },
  {
    "id": 5,
    "name": "Rates, Proportions, and Percents",
    "questionCount": "20",
    "tag": "Arithmetic"
  },
  {
    "id": 6,
    "name": "Tables, Statistics, and Probability",
    "questionCount": "20",
    "tag": "Functions and Graphs"
  },
  {
    "id": 7,
    "name": "Scatterplots",
    "questionCount": "10",
    "tag": "Functions and Graphs"
  },
  {
    "id": 8,
    "name": "Functions",
    "questionCount": "20",
    "tag": "Functions and Graphs"
  },
  {
    "id": 9,
    "name": "Exponents, Radicals, Polynomials,Rational Expressions",
    "questionCount": "16",
    "tag": "Algebra"
  },
  {
    "id": 10,
    "name": "Quadratics",
    "questionCount": "20",
    "tag": "Algebra"
  },
  {
    "id": 11,
    "name": "Lines, Angles, and Triangles",
    "questionCount": "15",
    "tag": "Geometry"
  },
  {
    "id": 12,
    "name": "Circles",
    "questionCount": "10",
    "tag": "Geometry"
  },
  {
    "id": 13,
    "name": "Three-Dimensional Figures",
    "questionCount": "10",
    "tag": "Geometry"
  },
  {
    "id": 14,
    "name": "Trigonometry",
    "questionCount": "8",
    "tag": "Trigonometry"
  },
  {
    "id": 15,
    "name": "Imaginary Numbers",
    "questionCount": "8",
    "tag": "Algebra"
  },













])

  // Build list strictly based on numberOfChapters; pull details from chaptersData if present
  const chapters = useMemo(
    () =>
      Array.from({ length: numberOfChapters }, (_, i) => {
        const data = chaptersData[i] || {}
        const idx = i + 1
        return {
          id: data.id ?? idx,
          name: data.chapterName ?? `Chapter ${idx}`,
          questionCount: data.questionCount ?? 0,
          tag: data.tag ?? "algebra",
        }
      }),
    [numberOfChapters, chaptersData],
  )

  // Navigation handler (navigate usage commented out to avoid routing errors)
  const handleOpenChapter = (chapter) => {
    navigate(`/user/practice/sat/maths/${chapter.id}`) // <- commented intentionally
    console.log("[ChaptersPage] Open chapter:", chapter.id)
  }

  return (
    <main className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-balance">Chapters</h1>
        <p className="text-sm text-muted-foreground">Select a chapter to view questions.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => handleOpenChapter(chapter)}
            aria-label={`Open ${chapter.name}`}
            className="rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-base font-medium">{chapter.name}</span>
              <span className="text-xs text-muted-foreground">
                {chapter.questionCount} {chapter.questionCount === 1 ? "question" : "questions"}
              </span>
              <span className="mt-2 inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                {chapter.tag}
              </span>
            </div>
          </button>
        ))}
      </div>

    </main>
  )
}
