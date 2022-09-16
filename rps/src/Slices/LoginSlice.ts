import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseURL = `${process.env.REACT_APP_AUTH_BASEURL}`;

interface loginState {
    loading: boolean;
    error: boolean;
    username?: string;
  };

const initialLoginState: loginState = {
    loading: false,
    error: false,
    username: ""
  };

export async function apiLogin(username:String, passphrase:String) {
     const body = {username, passphrase}

    return axios.post(`http://localhost:8000/user/login`, body).then(res => {
        return {
            status: res.status,
            payload: {
                token: res.data
            }
        }
    })

    // return{status: 202, payload: {
    //     token: "Bearer Hello I am a token"
    // }};
    
}

//const baseURL = `${process.env.REACT_APP_AUTH_API_ENDPOINT}`;

export async function apiValidateLogin(token:string|null) {

    const response = await axios.get(`http://localhost:8000/user/authenticate`, {
        headers: {
          'token': `${token}`
        }});
    return {status: response.status, payload: Boolean(response.data)};
}

export async function apiLogout(token:string|null) {
    const response = await axios.get(`http://localhost:8000/user/logout`, {
        headers: {
          'token': `${token}`
        }});
    return {status: response.status};
}

export async function apiRegister(username: string, passphrase: string) {
  const body = {username, passphrase}

 return axios.post(`http://localhost:8000/user/register`, body).then(res => {
     return {
         status: res.status,
         payload: {
             token: res.data
         }
     }
 })

 // return{status: 202, payload: {
 //     token: "Bearer Hello I am a token"
 // }};
 
}


export const loginSlice = createSlice({
    name: "user",
    initialState: initialLoginState,
    reducers: {
      clearUser: (state) => {
        state.username = "";
      },
      setUser: (state, action) =>{
        state.username = action.payload;
      }
    },
});

export const { clearUser, setUser } = loginSlice.actions;

export default loginSlice.reducer;


