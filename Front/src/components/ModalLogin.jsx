import { useContext, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import { useForm } from 'react-hook-form'
import { AuthContext } from "../context/AuthContext.jsx";




export default function ModalLogin() {

   const { modalLogin, setModalLogin } = useContext(AuthContext);

   const [retorno, setRetorno] = useState();

   const [cpf, setCpf] = useState("");

   const { show, type } = modalLogin;

   const { register, handleSubmit, formState: { errors } } = useForm();

   const { login, register: criarRegistro } = useContext(AuthContext);

   function handleClose() {
      setModalLogin({ show: false, type })
   }

   async function onSubmit(data) {
      let ret;
      if (type == 'login') {
         ret = await login(data);
      } else {
         ret = await criarRegistro(data);
      }

      if (ret.error) {
         setRetorno(ret)
      } else {
         handleClose()
      }

   }

   return (
      <Modal show={show} onHide={handleClose} keyboard={true} centered>
         <Modal.Header closeButton >
            <h3>{type == 'login' ? 'Login' : 'Registre-se'}</h3>
         </Modal.Header>
         <Modal.Body>
            {
               type == 'login' ?
                  <Container>
                     <Form>
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
                        <Form.Group>
                           <Form.Label>Senha</Form.Label>
                           <Form.Control type="password" {...register('senha', {
                              required: {
                                 value: true,
                                 message: 'Senha Obrigatória.'
                              }
                           })} />
                           {errors?.senha && (
                              <p className="error-message">{errors.senha.message}</p>
                           )}
                        </Form.Group>
                     </Form>
                  </Container> :
                  <Container>
                     <Form>
                        <Form.Group>
                           <Form.Label>Nome Completo</Form.Label>
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
                           <Form.Label>CPF</Form.Label>
                           <Form.Control type="text" {...register('cpf', {
                              required: {
                                 message: 'Nome obrigatório.',
                                 value: true
                              },
                              min: {
                                 value: 14,
                                 message: "CPF não informado corretamente"
                              },
                              max: {
                                 value: 14,
                                 message: "CPF não informado corretamente"
                              }
                           })} onChange={(event) => setCpf(cpfMask(event.target.value))} value={cpf} />
                           {errors?.email && (
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
                        <Form.Group>
                           <Form.Label>Senha</Form.Label>
                           <Form.Control type="password" {...register('senha', {
                              required: {
                                 value: true,
                                 message: 'Senha Obrigatória.'
                              }
                           })} />
                           {errors?.senha && (
                              <p className="error-message">{errors.senha.message}</p>
                           )}
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>Endereço</Form.Label>
                           <Form.Control type="text" {...register('endereco')} />
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>Cidade</Form.Label>
                           <Form.Control type="text" {...register('cidade')} />
                        </Form.Group>
                        <Form.Group>
                           <Form.Label>Estado</Form.Label>
                           <Form.Control type="text" {...register('estado')} style={{ textTransform: 'uppercase' }} minLength={2} maxLength={2} />
                        </Form.Group>
                     </Form>
                  </Container>
            }
            {retorno && <p className="error-message">{retorno.error}</p>}
         </Modal.Body>
         <Modal.Footer>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
               <Button variant="secondary" onClick={() => setModalLogin({ show, type: type == 'login' ? 'registre' : 'login' })} >
                  {type == 'login' ? 'Criar Conta' : 'Fazer login'}
               </Button>

               <Button onClick={() => handleSubmit(onSubmit)()}>
                  {type == 'login' ? 'Entrar' : 'Criar Conta'}
               </Button>
            </div>

         </Modal.Footer>
      </Modal>
   )
}

export const cpfMask = value => {
   return value
      .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}