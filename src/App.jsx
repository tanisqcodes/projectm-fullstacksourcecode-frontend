import { useState } from 'react'
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'
import './App.css'
import { Dashboard } from './dashboard.jsx'
import { PageNotFound } from './pageNotFound.jsx'
import { GoogleLogin } from './googleLogin.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google';
import {Question} from "./pages/question.jsx"
import { QuestionsPage } from './pages/questionsPage.jsx' 
import {SectionsPage } from './pages/sectionsPage.jsx'
import {ChaptersPage} from './pages/chaptersPage.jsx'
import {LandingPage} from './pages/landingPage.jsx'

 // import {QuizWindow} from './pages/questionWindow.jsx'

function App() {
 
    const GoogleAuthWrapper = ()  => { 
      return( 
        <GoogleOAuthProvider clientId='208828013989-ck6dh4abrj8melq3g76nufjkoc31l159.apps.googleusercontent.com'>
         <GoogleLogin> </GoogleLogin> 
          </GoogleOAuthProvider>

      )

    }
  return (
    <BrowserRouter>
    <Routes> 
      <Route path="/user/login" element={<GoogleAuthWrapper/>}/>
      <Route path="/" element={<LandingPage />}/>
  {/*    <Route path="/dashboard" element={<Dashboard/>} />  */} 
<Route path="*" element={<PageNotFound/>} />
 {/*  <Route path="/user/practice/sat/maths" element={<QuizWindow/>} /> */ } 
 <Route path="/user/practice/sat/maths/:chapter/:question" element={<Question/>}   />
 <Route path="/user/practice/sat/maths/:chapter"  element={<QuestionsPage/> }   /> 
 <Route path="/user/practice/sat/maths" element={< ChaptersPage/>} />
 <Route path="/user/practice/sat" element={< SectionsPage/>} />
      </Routes>
      </BrowserRouter>
  )
}

export default App
