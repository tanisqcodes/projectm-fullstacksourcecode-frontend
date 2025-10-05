import React, { useEffect } from "react"
import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from './api.js'
const GoogleLogin = () => {
    
    useEffect(() => {
        console.log('GoogleLogin component mounted');
        console.log('Google OAuth Client ID:', '208828013989-ck6dh4abrj8melq3g76nufjkoc31l159.apps.googleusercontent.com');
    }, []); 
    const responseGoogle = async (authResult) => { 
        try {
            console.log('Google auth result:', authResult);
            if( authResult['code']){
                console.log('Auth code received:', authResult['code']);
                const result = await googleAuth(authResult['code']); // this method calls the express server {googleAuth}
                console.log('Backend response:', result.data); 
                const {email, name , image} = result.data.data.user;
               
                // TODO: Store user data and redirect to dashboard
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
        flow: 'implicit', // Changed from auth-code to implicit
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