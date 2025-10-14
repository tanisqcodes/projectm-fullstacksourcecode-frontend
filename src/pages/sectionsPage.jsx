import React from "react" 
import {useNavigate}  from 'react-router-dom'
export const SectionsPage = () => { 
    const navigate = useNavigate()
    const mathsNavigator = () => { 
        navigate(`/user/practice/sat/maths`)

    }
    const randwNavigator = () => { 
        

    }

    return( 
        <>
        <button className="m-4" onClick={mathsNavigator}>Maths Section </button> 
        <button className = "m-4">Reading and Writing Section ; dont click; wont work </button> 

        
         </>
    )
}