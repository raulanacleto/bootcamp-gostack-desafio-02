import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import EncomendaEntregueController from './app/controllers/EncomendaEntregueController';
import StatusEncomendaController from './app/controllers/StatusEncomendaController';
import FileController from './app/controllers/FileController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import CancelOrderController from './app/controllers/CancelOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// rotas que precisam de token daqui para baixo
routes.use(authMiddleware);

routes.get('/users', UserController.index);

//----------------------------------------------------------------------------------
// rotas de /recipients
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);

//----------------------------------------------------------------------------------
// rotas de /entregadores
routes.get('/entregadores/', DeliverymanController.index);
routes.get('/entregadores/:deliverymanId', OrderController.index);
routes.get(
  '/entregadores/:deliverymanId/entregues',
  EncomendaEntregueController.index
);
routes.post('/entregadores', DeliverymanController.store);
routes.put('/entregadores/:id', DeliverymanController.update);
routes.delete('/entregadores/:id', DeliverymanController.delete);

//----------------------------------------------------------------------------------
// rotas de /encomendas
routes.get('/encomendas', OrderController.indexAll);
routes.post('/encomendas', OrderController.store);
routes.put('/encomendas/:id', OrderController.update);
routes.delete('/encomendas/:id', OrderController.delete);

// rotas de retirada e finalizacao de encomenda
routes.put('/encomendas/:orderId/retirar', StatusEncomendaController.retirar);

routes.post(
  '/file/encomenda/:orderId/finalizar',
  upload.single('file'),
  FileController.store
);

//----------------------------------------------------------------------------------
// rotas para problemas nas entregas
routes.get('/entrega-com-problema', DeliveryProblemController.index);
routes.get(
  '/entrega-com-problema/:orderId/problemas',
  DeliveryProblemController.problemasPorEntrega
);
routes.post('/entrega-com-problema/:orderId', DeliveryProblemController.store);
//----------------------------------------------------------------------------------
routes.delete(
  '/problema/:deliveryProblemId/cancelar-encomenda',
  CancelOrderController.cancelarPorIdProblema
);

export default routes;
