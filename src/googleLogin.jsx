import React, { useEffect,useState } from "react"
import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from './api.js'
// when you do google login , your jwt is set to local storage
import {useNavigate }from "react-router-dom"


const GoogleLogin = () => {
    const navigate = useNavigate()
    const [token, setToken ] = useState("")
    
    useEffect(() => {
        console.log('GoogleLogin component mounted');
       
    }, []); 

    useEffect(() => {
        if(token){ 
            localStorage.setItem("projectMJWT", token )

        }
        
    },[token])
    useEffect(() => {

     } ,[])




    const responseGoogle = async (authResult) => { 
        try {
            console.log('Google auth result give by googleAuthServer, recieved by React frontend:', authResult);
            if( authResult['code']){
              //  console.log('Auth code received:', authResult['code']);
                const result = await googleAuth(authResult['code']); // this method calls the express server {googleAuth}
                console.log('Backend response:', result.data); 
                const {email, name} = result.data.user;
                setToken( result.data.token ) 
                navigate(`/user/practice/sat`)


                
                
               






                // TODO: Store user data and redirect to dashboard 
                // result.data is backend response,  it has jwt token , authenticated user details ,{ _id, email} ,
                //  _id is from mongodb document for each user
                // email is primary key in socials-login mongodb collection for users
                //each jwt is payloaded with _id and email 


            }else{ 
                console.log("authResult['code'] not found ")
            }
        } catch (error) {
            console.error("Google auth failed:", error);
            if (error.response) {
                console.error("Error response:", error.response.data);
            }
        }
    }
    
    const handleGoogleError = (error) => {
        console.error("Google login error:", error);
    }
    
    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle, 
        onError: handleGoogleError,
        flow: 'auth-code', // Changed from auth-code to implicit
        scope: 'openid email profile',
        ux_mode: 'popup',
        select_account: true
    })

    return ( <>
    <div className = 'App'> 
        <button onClick = {googleLogin}>
            Login With Google
             </button>
        </div> 
    </>

    )
}
export {GoogleLogin}