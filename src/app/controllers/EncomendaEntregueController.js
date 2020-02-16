import { Op } from 'sequelize';
import Order from '../models/Order';

class EncomendaEntregueController {
  async index(req, res) {
    // todas as encomendas que nao foram canceladas e ja foram entregues
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        end_date: {
          [Op.ne]: null,
        },
        canceled_at: null,
      },
    });

    return res.json(orders);
  }
}
export default new EncomendaEntregueController();
