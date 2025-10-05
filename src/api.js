import axios from "axios"
const api = axios.create({ 
    baseURL: 'http://localhost:8000/user/auth'   // link of express server
})
export const googleAuth = (code) => { 
    return api.get(`/google?code=${code}`)
} 