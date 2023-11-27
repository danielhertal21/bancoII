import { Container, Row, Stack } from 'react-bootstrap';
import Produto from '../components/Produto.jsx';

import { getProtudos } from '../services/Api.js';
import { useContext, useEffect, useState } from 'react';

import ModalCompra from '../components/ModalCompra.jsx';

import { AuthContext } from '../context/AuthContext.jsx'

export default function Produtos() {
   const [produtos, setProdutos] = useState([]);

   const { isLogin, modalLogin, setModalLogin } = useContext(AuthContext)

   const [modal, setModal] = useState(false);
   const [produto, setProduto] = useState();

   function comprar(prod) {
      if (isLogin) {
         setProduto(prod);
         setModal(true);
      } else {
         setModalLogin({ show: true, type: 'login' })
      }
   }

   useEffect(() => {
      getProtudos().then(ax => {
         setProdutos(ax.data);
      })
   }, [])

   return (<>
      <Container style={{ justifyContent: 'center' }}>
         <Row >
            {
               produtos.map(p => <Produto key={p.codigo} produto={p} onClick={() => comprar(p)} />)
            }
         </Row>
      </Container>
      <ModalCompra show={modal} handleClose={() => setModal(false)} produto={produto} />
   </>
   );
}