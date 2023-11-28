import { useEffect, useState } from "react";
import { getIndicacao } from '../services/Api.js'

import { Table } from 'react-bootstrap'

export default function Indicacao() {
   const [dados, setDados] = useState([]);

   useEffect(() => {
      getIndicacao().then(data => setDados(data));
   }, [])

   return (
      <>
         <Table striped bordered hover>
            <thead>
               <tr>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Nome Indicado</th>
                  <th>Email Indicado</th>
               </tr>
            </thead>
            <tbody>
               {
                  dados.map(d =>
                     <tr key={d._id}>
                        <td>{d.cliente}</td>
                        <td>{d.produto}</td>
                        <td>{d.nome}</td>
                        <td>{d.email}</td>
                     </tr>
                  )
               }
            </tbody>
         </Table>
      </>
   );
}