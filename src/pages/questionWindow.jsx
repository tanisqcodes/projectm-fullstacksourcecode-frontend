"use client"

import { useEffect, useMemo, useState } from "react"

const LETTER_OPTIONS = ["A", "B", "C", "D"]

// Build a public Appwrite image URL if you pass endpoint/projectId and the row has bucketId/fileId
function buildAppwriteFileViewUrl({ endpoint, projectId, bucketId, fileId }) {
  if (!endpoint || !projectId || !bucketId || !fileId) return null
  return `${endpoint.replace(/\/$/, "")}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`
}

// Accept either a pre-normalized { questions: [...] } response
// or a raw response like the provided JSON with data.rows
function parseQuestionsFromResponse(raw, { appwriteEndpoint, appwriteProjectId }) {
  // Already normalized shape
  if (raw && Array.isArray(raw.questions)) {
    return raw.questions
  }

  // Provided JSON-like shape
  const rows = raw?.data?.rows
  if (Array.isArray(rows)) {
    return rows.map((row) => {
      const fromAppwrite = buildAppwriteFileViewUrl({
        endpoint: appwriteEndpoint,
        projectId: appwriteProjectId,
        bucketId: row.bucketId,
        fileId: row.questionImageResponseId,
      })
      const placeholder = "/question-image-with-options-a-b-c-d.jpg"
      return {
        id: row.questionId || row.$id || crypto.randomUUID(),
        topic: row.topic || "General",
        subtopic: row.subtopic || "Practice",
        level: row.level || "Easy",
        correctAnswer: row.answer || "A",
        hint: row.hint || "Consider translating the statement into an equation.",
        questionImageUrl: fromAppwrite || placeholder,
      }
    })
  }

  return []
}

export default function QuizWindow({ apiUrl = "/api/questions", appwriteEndpoint = "", appwriteProjectId = "" }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Per-question state
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(apiUrl, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`)
        const raw = await res.json()
        const parsed = parseQuestionsFromResponse(raw, { appwriteEndpoint, appwriteProjectId })
        if (!parsed || parsed.length === 0) throw new Error("No questions returned")
        if (isMounted) {
          setQuestions(parsed)
          setCurrentIndex(0)
        }
      } catch (e) {
        console.error(e)
        if (isMounted) setError(e.message || "Unable to load questions right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [apiUrl, appwriteEndpoint, appwriteProjectId])

  const currentQuestion = useMemo(
    () => (questions.length > 0 ? questions[currentIndex] : null),
    [questions, currentIndex],
  )

  // Reset per-question UI when the index changes
  useEffect(() => {
    setSelectedOption(null)
    setIsSubmitted(false)
    setIsCorrect(false)
    setShowFeedback(false)
    setShowHint(false)
  }, [currentIndex])

  const handleOptionSelect = (opt) => {
    if (!isSubmitted) setSelectedOption(opt)
  }

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return
    const correct = selectedOption === currentQuestion.correctAnswer
    setIsSubmitted(true)
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      alert("You're all done. Great work!")
    }
  }

  // Loading / Error states


  if (loading){
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-gray-600">Loading questions…</div>
      </main>
    )
  }
    if (error || !currentQuestion){ 
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Oops</h1>
          <p className="text-gray-600 mb-4">{error || "We couldn’t find any questions."}</p>
          <button
            onClick={() => location.reload()}
            className="px-5 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header: topic, subtopic, level, question counter */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Badge label="Topic" value={currentQuestion.topic} color="blue" />
            <Badge label="Subtopic" value={currentQuestion.subtopic} color="purple" />
            <LevelBadge level={currentQuestion.level} />
            <span className="ml-1 sm:ml-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs sm:text-sm font-medium">
              {currentIndex + 1} of {questions.length}
            </span>
          </div>
          {/* No Questions button (removed) */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8 relative">
          {/* Question image */}
          <div className="mb-4 sm:mb-6">
            <div className="flex justify-center">
              <img
                src={currentQuestion.questionImageUrl || "/placeholder.svg?height=400&width=600&query=question%20image"}
                alt={`Question ${currentIndex + 1} image`}
                className="w-full h-auto max-h-[60vh] object-contain rounded-md border border-gray-100"
              />
            </div>
          </div>

          {/* Options: letters only (2x2 responsive grid) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {LETTER_OPTIONS.map((opt) => {
              const isSelected = selectedOption === opt
              const isAnswer = currentQuestion.correctAnswer === opt
              const base =
                "flex items-center justify-center h-14 sm:h-16 rounded-lg border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              let styles = "border-gray-200 hover:border-blue-300 hover:bg-blue-50"

              if (!isSubmitted && isSelected) {
                styles = "border-blue-500 bg-blue-600 text-white"
              }
              if (isSubmitted) {
                if (isAnswer) styles = "border-green-500 bg-green-50"
                else if (isSelected && !isAnswer) styles = "border-red-500 bg-red-50"
                else styles = "border-gray-200 bg-gray-50 text-gray-500"
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isSubmitted}
                  aria-pressed={!isSubmitted && isSelected}
                  className={`${base} ${styles}`}
                >
                  <span
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
                      isSubmitted
                        ? isAnswer
                          ? "bg-green-600 text-white"
                          : isSelected
                            ? "bg-red-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        : isSelected
                          ? "bg-white text-blue-600"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`mb-4 sm:mb-6 p-4 sm:p-5 rounded-md border ${
                isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCorrect ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  <span className="text-white text-sm font-bold">{isCorrect ? "✓" : "✗"}</span>
                </div>
                <div className="text-sm sm:text-base">
                  <div className={`font-semibold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </div>
                  {!isCorrect && <p className="mt-2 text-gray-700">Review the question or open the hint.</p>}
                </div>
              </div>
            </div>
          )}

          {/* Hint: available anytime (no timer restrictions) */}
          <div className="mb-4 sm:mb-6">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition"
              >
                Show Hint
              </button>
            ) : (
              <div className="p-4 sm:p-5 rounded-md border border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                    !
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-800 mb-1">Hint</div>
                    <p className="text-sm sm:text-base text-yellow-800">{currentQuestion.hint}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowHint(false)}
                    className="text-sm px-3 py-1.5 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition"
                  >
                    Hide Hint
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions: Submit / Next / Try again */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-3">
              {!isSubmitted && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className="px-5 sm:px-6 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </button>
              )}
              {isSubmitted && !isCorrect && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(null)
                    setIsSubmitted(false)
                    setShowFeedback(false)
                  }}
                  className="px-5 sm:px-6 py-2.5 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
                >
                  Try Again
                </button>
              )}
              {isSubmitted && isCorrect && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 sm:px-6 py-2.5 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Next Question →
                </button>
              )}
            </div>
            {/* No Skip button (removed) */}
          </div>
        </section>
      </main>
    </div>
  )
}

// Small badge components for header
function Badge({ label, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${colors[color]}`}
      title={label}
      aria-label={`${label}: ${value}`}
    >
      {value}
    </span>
  )
}

function LevelBadge({ level }) {
  const isEasy = String(level).toLowerCase() === "easy"
  const cls = isEasy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  return (
    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${cls}`} aria-label={`Level: ${level}`}>
      {level}
    </span>
  )
}
