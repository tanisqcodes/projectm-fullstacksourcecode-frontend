import React from "react"
import {Client , Storage } from 'appwrite'
import { useMemo, useState, useEffect } from "react"
import  {useNavigate, useParams } from "react-router-dom"
const projectId = import.meta.env.VITE_PROJECT_ID
const chapters =[["dummychapter","0"],["Linear Equations","20"],["Systems of Linear Equations","15"],["Inequalities","12"],["Rates, Proportions, and Percents","20"],["Tables, Statistics, and Probability","20"],["Scatterplots","10"],["Functions","20"],[
  "Exponents, Radicals, Polynomials,Rational Expressions","16"],["Quadratics","20"],["Lines, Angles, and Triangles","15"],["Circles","10"],["Three-Dimensional Figures","10"],["Trigonometry","8"],["Imaginary Numbers","8"] ]      // array of pairs , first element of pair is chapterName and second element is number of questions, index is chapterNumber
export const QuestionsPage = () =>  {
    // chapterNumber is set by parameter , whenever the component loads : DONE 

    // now we'll write the api to fetch the number of questions in the chapter
    const client = new Client().setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject(projectId)
  const {chapter} = useParams()





    // const navigate = useNavigate()
  
    // You will replace these with your API-populated values later.
    const [chapterNumber, setChapterNumber] = useState(2)
    const [chapterName, setChapterName] = useState("Algebra Basics")
    const [totalQuestions, setTotalQuestions] = useState(10)
  
    
  
    const handleChapterNumber = (love) => { 
        setChapterNumber(love)
    }
    const handleChapterName = (love) => {  // waste function
        setChapterName(love)
    }
    const handleTotalQuestions = (love) => { 
      setTotalQuestions(love)
    }
   
     useEffect(() => { 
      handleChapterNumber(chapter)
     } ,
      [chapter])

    useEffect( () => {
       
        handleChapterName(chapters[chapterNumber-1][0])
        handleTotalQuestions(chapters[chapterNumber-1][1])
        
       
        
     }, [chapterNumber])
     const questionNumbers = useMemo(
      () => Array.from({ length: Math.max(0, totalQuestions) }, (_, i) => i + 1),
      [totalQuestions],
    )

    const navigate = useNavigate()
    const goToQuestion = (questionNumber) => {
    navigate(`/user/practice/sat/maths/${chapterNumber}/${questionNumber}`)
    }
     // chapterNumber will come as paramter

     // chapterName and number of questions in Will be hardcoded in an array : DONE

     // api to call how many number of questions in the chapter and which are solved by user : 

     // user-question pair will be implemented in mongodb  :   



     // TODO: just implement onClick on button , how question.jsx will load with
     // passed parameter and routing
     
     useEffect( () => {  // writing api to call how many questions are solved by user :
        ;(async() => { 

             
        })( )
     } , [])
  
    return (
      <main
        className="qp-root"
        style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
        aria-label="Questions Page"
      >
        <style>{`
          .qp-grid {
            display: grid;
            gap: 16px;
            max-width: 900px;
            margin: 0 auto; /* center grid, leaving left/right margins */
            grid-template-columns: 1fr; /* mobile: 1 per row */
          }
          @media (min-width: 640px) {
            .qp-grid { grid-template-columns: repeat(2, 1fr); } /* tablet: 2 per row */
          }
          @media (min-width: 960px) {
            .qp-grid { grid-template-columns: repeat(3, 1fr); } /* desktop: 3 per row */
          }
  
          /* Modern minimalism: neutral palette + subtle focus accent */
          .qp-btn {
            width: 100%;
            padding: 16px 14px;
            min-height: 56px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;   /* neutral border */
            background: #ffffff;          /* white card style */
            color: #111827;               /* near-black text */
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: background 120ms, transform 80ms, box-shadow 120ms;
          }
          .qp-btn:hover {
            background: #f9fafb;
            box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          }
          .qp-btn:active {
            transform: translateY(1px);
          }
          .qp-btn:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px rgba(14,165,233,0.35); /* subtle sky accent */
          }
  
          .qp-chapter {
            font-size: 47px;
            line-height: 1.15;
          }
          @media (min-width: 960px) {
            .qp-chapter { font-size: 57px; } /* larger on desktop */
          }
        `}</style>
        <header style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 24 }}>
          <div style={{ textAlign: "left", order: -1 }}>
            <h1
              className="qp-chapter"
              style={{
                margin: 0,
                fontWeight: 700,
                color: "#111",
                lineHeight: 1.2,
              }}
              aria-label={`Chapter name: ${chapterName}`}
              title={chapterName}
            >
              {chapterName}
            </h1>
            <div style={{ marginTop: 4, color: "#777", fontSize: 14 }}>{`Chapter #${chapterNumber}`}</div>
          </div>
  
          <div style={{ width: "100%", marginTop: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "#555" }}>{"Questions"}</h2>
            <p style={{ margin: "6px 0 0", color: "#666" }}>{"Choose a question to begin solving."}</p>
          </div>
        </header>
  
        <section aria-label="Question Buttons">
          {questionNumbers.length === 0 ? (
            <div
              role="status"
              style={{
                padding: "16px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                color: "#6b7280",
                background: "#fafafa",
              }}
            >
              {"No questions available for this chapter yet."}
            </div>
          ) : (
            <div className="qp-grid">
              {questionNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => goToQuestion(num)}
                  aria-label={`Go to Question ${num}`}
                  className="qp-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 120ms, transform 80ms, box-shadow 120ms",
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "translateY(1px)"
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb"
                    e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  {`Question ${num}`}
                </button>
              ))}
            </div>
          )}
        </section>
  
        
      </main>
    )
  }