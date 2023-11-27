import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Produto({ onClick, produto }) {
   const { imagem, preco, nome } = produto;

   let reais = preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

   return (
      <Card style={{ width: '18rem', marginTop: '20px', marginRight: '20px' }}>
         <Card.Img variant="top" src={`${import.meta.env.VITE_API}/public/${imagem}`} height='250px' />
         <Card.Body>
            <Card.Title>{reais}</Card.Title>
            <Card.Text>{nome}</Card.Text>
         </Card.Body>
         <Card.Footer>
            <Button variant="primary w-100" onClick={onClick}>Comprar</Button>
         </Card.Footer>
      </Card>
   );
}

export default Produto;