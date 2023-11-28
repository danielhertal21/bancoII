import axios from "axios";

export const api = axios.create({
   baseURL: `${import.meta.env.VITE_API}`,
   headers: {
      'Content-Type': 'application/json',
   }
});

export const createSession = async (dados) => {
   try {
      const retorno = await api.post('/login', { email: dados.email, senha: dados.senha });
      return retorno.data;
   } catch (e) {
      return e.response.data;
   }
}

export const registroSession = async (dados) => {

   try {
      const retorno = await api.post('/cadastro', dados);
      return retorno.data;
   } catch (e) {
      return e.response.data;
   }
}

export async function getProtudos() {
   return api.get('/produtos');
}

export async function postVenda(dados) {
   try {
      const retorno = await api.post('/venda', dados, { headers: { 'Authorization': localStorage.getItem('token') } });
      return retorno.data;
   } catch (e) {
      return e.response?.data;
   }
}

export async function getVendas() {
   try {
      const retorno = await api.get('/venda');
      return retorno.data;
   } catch (e) {
      return e.response?.data;
   }
}

export async function getIndicacao() {
   try {
      const retorno = await api.get('/indicacao');
      return retorno.data;
   } catch (e) {
      return e.response?.data;
   }
}