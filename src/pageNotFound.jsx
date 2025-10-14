import React from "react"
import {useNavigate} from 'react-router-dom'
export const PageNotFound = () =>{ 
    const navigate = useNavigate()
    return( 
        <> 
        <div>
            <h2>
                404 page not found </h2> 
                <button onClick ={ () => { 
                    navigate("/")
                }}> 
                    take me to LandingPage
                     </button>
        </div> 
        </>
    )
}
