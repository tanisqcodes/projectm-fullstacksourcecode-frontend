import React, {useState, useEffect} from "react"
import axios from "axios"
import {Client , Storage} from "appwrite"
const projectId = import.meta.env.VITE_PROJECT_ID
export const Question = () => { 
    // only questions which are mcq will render in this
     const client = new Client().setEndpoint("https://nyc.cloud.appwrite.io/v1")
     .setProject("689a3278003571660e5b")
     const storage = new Storage(client)
     





















     const [questionReceived , setQuestionReceived] = useState("false") // if questionReceived is false , then we 
     // can show loading else we can render question


    
    
    const [chapterNumber, setChapterNumber] = useState("chapter 2")  // these values will come from user
    const [questionNumber , setQuestionNumber] = useState("3") // will come from user
    const [topic, setTopic ] = useState("")
    const [subtopic , setSubtopic] = useState("")
    const [level , setLevel ] = useState("")
    const [answer, setAnswer ] = useState("")
    const [hint, setHint ] = useState("") 
    const [showExplanation, setShowExplanation] = useState(false)
    
    let response= "empty";
    let bucketId;
    let questionImageResourceLink; // this is the response.$id of the questionImage in storage in appwrite
    let answerImageResourceLink // this is the response.$id of the answerImage in storage in appwrite
    let answerImageLink; // this is the final link for accessing the answer image  
    let questionImageLink; // this is the final link for accessing the question image
const [answerImageUrl, setAnswerImageUrl] =useState("") // states for urls
const [questionImageUrl, setQuestionImageUrl] = useState("") // states for urls 



const handleAnswerImageUrl = (love ) => { 
setAnswerImageUrl(love)
}
const handleQuestionImageUrl = (love ) => { 
    setQuestionImageUrl(love)
}
const handleQuestionReceived = (love) =>{ 
        setQuestionReceived(love)
    }

    const handleAnswer = (love) =>{ 
        setAnswer(love)
    }
    const handleLevel = (love) =>{ 
        setLevel(love)
    }
    const handleTopic = (love) =>{ 
        setTopic(love)
    }
    const handleSubtopic = (love) =>{ 
        setSubtopic(love)
    }
    const handleHint = (love) =>{ 
        setHint(love)
    }








    
   

    useEffect( () => { 
        ;(
            async() => { 
                try {
                    response = await axios.get('http://localhost:8000/user/practice/sat/maths', { 
                        params: {
                            chapterNumber: chapterNumber, 
                            questionNumber: questionNumber
                        }
                    })

                    if( response === "empty"){ 
                        // some kind of state for failiure
                    }
                     //  topic  = questionObject.data.rows[1]
                    console.log(response.data.data.rows[0]) // this is the object which has every attribute of appwrite database satMathKaplan
                    
          //   questionImageResourceLink = response.data.data.rows[0].questionImageResponseId
         //  answerImageResourceLink = response.data.data.rows[0].answerImageResponseId





          answerImageLink = storage.getFileView({ 
            bucketId: response.data.data.rows[0].bucketId,
            fileId: response.data.data.rows[0].answerImageResponseId, 
          //  width: '620', 
          //   quality: '65', image transformation are blocked on current plan
    
         });
         questionImageLink = storage.getFileView({ 
            bucketId: response.data.data.rows[0].bucketId, 
            fileId: response.data.data.rows[0].questionImageResponseId,
          //   width: '620', 
          //   quality: '65', image transformation are blocked on current plan
        
        
        });

        handleAnswerImageUrl(answerImageLink)
        handleQuestionImageUrl(questionImageLink)
        handleAnswer(response.data.data.rows[0].answer)
        handleLevel(response.data.data.rows[0].level)
        handleTopic(response.data.data.rows[0].topic)
        handleSubtopic(response.data.data.rows[0].subtopic)
        handleHint(response.data.data.rows[0].hint)



       //  console.log("questionImageLink: " , questionImageLink)
        // console.log("answerImageLink: ",answerImageLink)
                } catch (error) {
                    console.log("there happend an error when react frontend fetching questionObject from express server, error: ", error)
                    
                }
            }
        )()
       

    }, [])
    
    useEffect(() =>{ 
        if( response !== "empty"){
            HandleQuestionReceived("true")
            
         }
    }, [response]) 

    useEffect(() => { },

     []) 





     // from v0  -----&---------&---------------&------------


     const LETTER_OPTIONS = ["A", "B", "C", "D"]
     const [selectedOption, setSelectedOption] = useState(null)
     const [isSubmitted, setIsSubmitted] = useState(false)
     const [isCorrect, setIsCorrect] = useState(false)
     const [showHint, setShowHint] = useState(false)
   
     // Replace or remove this submit logic if you plan to validate elsewhere
     function handleSubmit() {
       if (!selectedOption) return
       const correct = selectedOption === answer
       setIsSubmitted(true)
       setIsCorrect(correct)
     }
   
     function resetAttempt() {
       setSelectedOption(null)
       setIsSubmitted(false)
     }
   
     // Simple helpers for level badge color
     const levelIsEasy = String(level).toLowerCase() === "easy"
     const levelBadge = levelIsEasy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
















     

     return (
        <div className="bg-gray-50 min-h-screen">
          {/* Header: topic, subtopic, level */}
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-2">
              <Badge value={topic} color="blue" />
              <Badge value={subtopic} color="purple" />
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${levelBadge}`}>
                {level}
              </span>
            </div>
          </header>
    
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <section className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6 md:p-8">
              {/* Question image */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-center">
                  <img
                    src={questionImageUrl /*  ||  "dummyImageLink" */} 
                    alt="Question"
                    className="w-full h-auto max-h-[60vh] object-contain rounded-md border border-gray-100"
                  />
                </div>
              </div>
    
              {/* Options: letters only (responsive 2x2) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {LETTER_OPTIONS.map((opt) => {
                  const isSelected = selectedOption === opt
                  const isAnswer = answer === opt
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
                      onClick={() => !isSubmitted && setSelectedOption(opt)}
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
    
              {/* Feedback (minimal) */}
              {isSubmitted && (
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
                    </div>
                  </div>
                </div>
              )} 

              { /** here is the new addition to working for answer explaination */}
              {/* Answer Explanation trigger and image (only when incorrect) */}
          {isSubmitted && !isCorrect && !showExplanation && (
            <div className="mb-4 sm:mb-6">
              <button
                type="button"
                onClick={() => setShowExplanation(true)}
                className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Show Answer Explanation
              </button>
            </div>
          )}

          {isSubmitted && !isCorrect && showExplanation && (
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-center">
                <img
                  src={
                    answerImageUrl
                  }
                  alt="Answer explanation"
                  className="w-full h-auto max-h-[60vh] object-contain rounded-md border border-gray-100"
                />
              </div>
            </div>
          )}




    
              {/* Hint (always available) */}
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
                        <p className="text-sm sm:text-base text-yellow-800">{hint}</p>
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
    
              {/* Actions (no next navigation) */}
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
                      onClick={resetAttempt}
                      className="px-5 sm:px-6 py-2.5 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition"
                    >
                      Try Again
                    </button>
                  )}
                </div>
                {/* Intentionally no "Skip" or "Next" buttons */}
              </div>
            </section>
          </main>
        </div>
      )
}

function Badge({ value, color = "blue" }) {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      purple: "bg-purple-100 text-purple-800",
    }
    return <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${colors[color]}`}>{value}</span>
  }



