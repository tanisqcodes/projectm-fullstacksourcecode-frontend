import React, {useEffect, useState} from "react"
import axios from "axios"
import {useNavigate} from "react-router-dom"

export const LandingPage = () => { 
    const navigate = useNavigate()
    let response;
    const token = localStorage.getItem("projectMJWT")
    // console.log(token)

    const [isJwtValid, setIsJwtValid] = useState(false)
    
    




    





    useEffect(() => { 
        ;(
            async() => { 
               try {
                 response = await axios.get("http://localhost:8000/user/auth/landingPageJWTVerifier",
                    {  
                        params: { 
                     token
                 }
               }
            ) 
            if( response.status === 200){ 
                setIsJwtValid(true)
            }
           
          // console.log(response.status)
               } catch (error) {
                // if localStorage.getItem("") exists it will either be 403, 200
                console.log(error)
                
               }
               

            }
        )()
// this useEffect method will call the api to check if there is jwt token is there in localStorage
    },[]);

    const navigator = ( ) => { 
        if(isJwtValid === true){ 
            navigate(`/user/practice/sat`)
        }else{ 
            navigate(`/user/login`)

        }
        
    }
   








    // fetching
    return(
        <>  <div className="p-4 bg-black-200 text-white">landing page soon , aint done with building </div> 
            <div className="p-4 bg-red-500 text-white">did not had enough time for frontend, want to solve questions for SAT, press on button below</div>
            <button className = "m-4" onClick={() => {
                // navigating
                navigator()

             }} > start solving </button>
         </>
    )
}