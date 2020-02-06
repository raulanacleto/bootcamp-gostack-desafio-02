import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'token not provided' });
  }

  // capturando o token que foi enviado pelo header, usando split pra separar.
  // exemplo de como vem: 'Bearer ey9asdasdi9ada.asididaopsdi.asd0d'
  const [, token] = authHeader.split(' '); // seria asim: const [bearer, token] - porem como nao vamos usar o bearer, podemos ignorar ele retornanro assim: [, token]

  try {
    // promisify serve pra usar async await em funcoes antigas (que usavam callback)
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // seta na requisicao o id do usuario que foi pego atraves do token
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
