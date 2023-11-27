import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header.jsx"
import Produtos from './pages/Produtos.jsx';
import Vendas from './pages/Vendas.jsx';
import Indicacao from './pages/Indicacao.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path='/' Component={Produtos} />
            <Route path='/vendas' Component={Vendas} />
            <Route path='/indicacao' Component={Indicacao} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
