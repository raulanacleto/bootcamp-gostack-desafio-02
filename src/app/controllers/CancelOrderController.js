import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class CancelOrderController {
  async cancelarPorIdProblema(req, res) {
    const deliveryProblem = await DeliveryProblem.findByPk(
      req.params.deliveryProblemId
    );

    if (!deliveryProblem) {
      return res
        .status(400)
        .json({ erro: 'encomendaProblema informada nao existe ' });
    }

    const order = await Order.findByPk(deliveryProblem.delivery_id, {
      include: [
        {
          model: Recipient,
          as: 'cliente',
          attributes: ['id', 'nome'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!order) {
      return res.status(400).json({ erro: 'order informada nao existe ' });
    }

    order.canceled_at = new Date();
    await order.save();

    // enviar email para o entregador avisando do cancelamento
    await Queue.add(CancellationMail.key, {
      order,
    });

    return res.json(order);
  }
}

export default new CancelOrderController();
