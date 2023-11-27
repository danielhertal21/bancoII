import { useContext, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx';
import ModalLogin from './ModalLogin.jsx';

export default function Header() {
   const navigate = useNavigate();
   const { isLogin, loggof, setModalLogin } = useContext(AuthContext);

   return (<>
      <Navbar expand="lg" className="bg-body-tertiary">
         <Container>
            <Navbar.Brand >E-Commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link onClick={() => navigate('/')}>Produtos</Nav.Link>
                  <Nav.Link onClick={() => navigate('vendas')}>Vendas</Nav.Link>
                  <Nav.Link onClick={() => navigate('indicacao')}>Indicações</Nav.Link>
               </Nav>
               <Nav>
                  {

                     isLogin ?
                        <Nav.Link onClick={loggof}>Sair</Nav.Link> :
                        <>
                           <Nav.Link onClick={() => setModalLogin({ show: true, type: 'login' })}>Login</Nav.Link>
                           <Nav.Link onClick={() => setModalLogin({ show: true, type: 'registre' })}>Registre-se</Nav.Link>
                        </>
                  }
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
      <ModalLogin />
   </>
   );
}