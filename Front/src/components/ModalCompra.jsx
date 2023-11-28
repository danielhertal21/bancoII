import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { postVenda } from '../services/Api.js';
import { useForm } from 'react-hook-form';

export default function ModalCompra({ show = false, handleClose = () => { }, produto = {} }) {
   const [quantidade, setQuantidade] = useState();

   const { imagem, preco = 0.0, nome } = produto;

   const { register, formState: { errors }, handleSubmit, reset } = useForm();

   useEffect(() => {
      setQuantidade(1);
      reset({
         nome: '',
         email: ''
      })
   }, [show])

   async function onSubmit(dados) {
      const ret = await postVenda({ ...dados, produto: produto.codigo, quantidade });
      if (ret?.error) {
         alert(ret.error)
      } else {
         handleClose()
         setTimeout(() => alert('Compra efetuada com sucesso'), 150)
      }
   }

   return (
      <>
         <Modal
            show={show}
            onHide={handleClose}
            keyboard={true}>
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
               <hr className="half-rule" />
               <h4 style={{ textAlign: 'center' }}>Indicação</h4>
               <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" {...register('nome', {
                     required: {
                        message: 'Nome obrigatório.',
                        value: true
                     }
                  })} />
                  {errors?.nome && (
                     <p className="error-message">{errors.nome.message}</p>
                  )}
               </Form.Group>
               <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" {...register('email', {
                     required: {
                        message: 'Email obrigatório.',
                        value: true
                     },
                     pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email invalido.",
                     }
                  })} />
                  {errors?.email && (
                     <p className="error-message">{errors.email.message}</p>
                  )}
               </Form.Group>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                  Voltar
               </Button>
               <Button variant="primary" onClick={handleSubmit(onSubmit)}>Comprar</Button>
            </Modal.Footer>
         </Modal >
      </>
   );


}