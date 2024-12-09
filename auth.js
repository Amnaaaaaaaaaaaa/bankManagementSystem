//src/api/auth.js
import axios from 'axios';


export const loginUser = (data) => axios.post(`${"http://localhost:5000/api"}/auth/login`, data);
export const signupUser = (data) => axios.post(`${"http://localhost:5000/api"}/auth/signup`, data);
