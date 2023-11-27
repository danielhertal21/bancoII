import { createContext, useState } from "react";
import { jwtDecode } from 'jwt-decode';

import { createSession, registroSession } from '../services/Api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

   const [token, setToken] = useState(localStorage.getItem('token'));

   const [modalLogin, setModalLogin] = useState({ show: false, type: 'login' });

   function verificaToken() {
      if (!token) return false;
      const decoded = jwtDecode(token)
      if (new Date(decoded.exp * 1000) > new Date()) {
         return true;
      }
      return false;
   }

   async function login(data) {
      const ret = await createSession(data);
      if (ret.error) return ret;

      if (ret.token) {
         localStorage.setItem('token', ret.token);
         setToken(ret.token)
      }
      return ret;
   }

   async function register(data) {
      const ret = await registroSession(data);
      if (ret.error) return ret;

      if (ret.token) {
         localStorage.setItem('token', ret.token);
         setToken(ret.token)
      }
      return ret;
   }

   function loggof() {
      localStorage.removeItem('token')
      setToken('');
   }

   return (
      <AuthContext.Provider value={{ isLogin: verificaToken(), login, register, loggof, modalLogin, setModalLogin }}>
         {children}
      </AuthContext.Provider>
   );

}