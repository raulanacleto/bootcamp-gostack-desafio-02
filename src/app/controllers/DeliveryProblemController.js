import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const deliveries = await DeliveryProblem.findAll({
      order: ['delivery_id'],
    });

    return res.json(deliveries);
  }

  async problemasPorEntrega(req, res) {
    const deliveries = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.orderId,
      },
      order: ['created_at'],
    });
    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res.status(400).json({ erro: 'order informada nao existe' });
    }

    const { delivery_id, description } = await DeliveryProblem.create(req.body);

    return res.json({
      delivery_id,
      description,
    });
  }
}
export default new DeliveryProblemController();
