import { Op } from 'sequelize';
import Encomenda from '../models/Encomenda';

class EncomendaEntregueController {
  async index(req, res) {
    // todas as encomendas que nao foram canceladas e ja foram entregues
    const encomendas = await Encomenda.findAll({
      where: {
        deliveryman_id: req.params.entregadorId,
        end_date: {
          [Op.ne]: null,
        },
        canceled_at: null,
      },
    });

    return res.json(encomendas);
  }
}
export default new EncomendaEntregueController();
