import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function ModalCompra({ show = false, handleClose = () => { }, produto = {} }) {
   const [quantidade, setQuantidade] = useState();

   const { imagem, preco = 0.0, nome } = produto;

   useEffect(() => {
      setQuantidade(1);
   }, [show])


   return (
      <>
         <Modal
            show={show}
            onHide={handleClose}
            keyboard={true}
         >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
               <Card.Img variant="top" src={`${import.meta.env.VITE_API}/public/${imagem}`} style={{ width: '200px', margin: 'auto', display: 'block' }} />
               <Card.Title>{preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Card.Title>
               <Card.Text>{nome}</Card.Text>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <ButtonGroup aria-label="Basic example">
                     <Button variant="secondary" onClick={() => quantidade > 1 ? setQuantidade(quantidade - 1) : false}>-</Button>
                     <input className='form-control' type='number' style={{ width: '60px', textAlign: 'center' }} min={1} value={quantidade} onChange={
                        (event) => setQuantidade(parseInt(event.target.value.replace('-', '')))
                     } />
                     <Button variant="secondary" onClick={() => setQuantidade(quantidade + 1)}>+</Button>
                  </ButtonGroup>
                  <h5>Total {(preco * quantidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</h5>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                  Voltar
               </Button>
               <Button variant="primary">Comprar</Button>
            </Modal.Footer>
         </Modal >
      </>
   );


}