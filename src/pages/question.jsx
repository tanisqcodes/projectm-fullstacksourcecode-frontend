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


    const [selectedanswer, setSelectedAnswer] = useState("")
    
    const [chapterNumber, setChapterNumber] = useState("chapter 2")  // these values will come from user
    const [questionNumber , setQuestionNumber] = useState("3") // will come from user
    const [topic, setTopic ] = useState("")
    const [level , setLevel ] = useState("")
    const [answer, setAnswer ] = useState("")
    const [hint, setHint ] = useState("")
    
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
const HandleQuestionReceived = (love) =>{ 
        setQuestionReceived(love)
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


        console.log("questionImageLink: " , questionImageLink)
        console.log("answerImageLink: ",answerImageLink)
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















     

    return( 
        <> 
         <div style={{
      width: "80%",
      maxWidth: "800px",
      margin: "20px auto",
      border: "2px dashed #888",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f0f0",
      overflow: "hidden",
      borderRadius: "10px"
    }}> 
      <img
        src= {answerImageUrl}
        alt="Preview"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain"
        }}
      />
    </div>
        </>

    )
}



