import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';

import RecipientController from './app/controllers/RecipientController';
import EntregadorController from './app/controllers/EntregadorController';
import EncomendaController from './app/controllers/EncomendaController';
import EncomendaEntregueController from './app/controllers/EncomendaEntregueController';
import StatusEncomendaController from './app/controllers/StatusEncomendaController';
import FileController from './app/controllers/FileController';
import EntregaProblemaController from './app/controllers/EntregaProblemaController';
import CancelarEncomendaController from './app/controllers/CancelarEncomendaController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// rotas que precisam de token daqui para baixo
routes.use(authMiddleware);
//----------------------------------------------------------------------------------
// rotas de /recipients
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);

//----------------------------------------------------------------------------------
// rotas de /entregadores
routes.get('/entregadores/:entregadorId', EncomendaController.index);
routes.get(
  '/entregadores/:entregadorId/entregues',
  EncomendaEntregueController.index
);
routes.post('/entregadores', EntregadorController.store);
routes.put('/entregadores/:id', EntregadorController.update);
routes.delete('/entregadores/:id', EntregadorController.delete);

//----------------------------------------------------------------------------------
// rotas de /encomendas
routes.get('/encomendas', EncomendaController.indexAll);
routes.post('/encomendas', EncomendaController.store);
routes.put('/encomendas/:id', EncomendaController.update);
routes.delete('/encomendas/:id', EncomendaController.delete);

// rotas de retirada e finalizacao de encomenda
routes.put(
  '/encomendas/:encomendaId/retirar',
  StatusEncomendaController.retirar
);

routes.post(
  '/file/encomenda/:encomendaId/finalizar',
  upload.single('file'),
  FileController.store
);

//----------------------------------------------------------------------------------
// rotas para problemas nas entregas
routes.get('/entrega-com-problema', EntregaProblemaController.index);
routes.get(
  '/entrega-com-problema/:entregaId/problemas',
  EntregaProblemaController.problemasPorEntrega
);
routes.post(
  '/entrega-com-problema/:entregaId',
  EntregaProblemaController.store
);
//----------------------------------------------------------------------------------
routes.delete(
  '/problema/:entregaProblemaId/cancelar-encomenda',
  CancelarEncomendaController.cancelarPorIdProblema
);

export default routes;
