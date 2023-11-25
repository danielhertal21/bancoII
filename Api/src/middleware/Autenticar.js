import express from 'express';
import jwt from 'jsonwebtoken';

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Provider<express.Response>}
 */
export default (req, res, next) => {

   let { authorization } = req.headers;

   if (!authorization) return res.status(401).send({ error: "Cliente não autenticado" });

   authorization = authorization.replace("Bearer ", "");

   jwt.verify(authorization, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send({ error: "Token expirado" });

      req.userId = decoded.codigo;
      req.userName = decoded.name;
      req.userEmail = decoded.email;
   });

   next();
}