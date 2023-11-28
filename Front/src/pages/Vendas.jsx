import { useEffect, useState } from "react";
import { getVendas } from '../services/Api.js'

import { Table } from 'react-bootstrap'

export default function Vendas() {
   const [dados, setDados] = useState([]);

   useEffect(() => {
      getVendas().then(data => setDados(data));
   }, [])


   return (
      <>
         <Table striped bordered hover>
            <thead>
               <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor Total</th>
               </tr>
            </thead>
            <tbody>
               {
                  dados.map(d =>
                     <tr key={d.codigo}>
                        <td>{d.codigo}</td>
                        <td>{d.cliente_nome}</td>
                        <td>{d.produto_nome}</td>
                        <td>{d.quantidade}</td>
                        <td>{d.valor_total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                     </tr>

                  )
               }
            </tbody>
         </Table>

      </>
   );
}