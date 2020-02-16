import * as Yup from 'yup'; // serve pra fazer validacoes, exemplo: se digitou nome de usuario no campo 'name'
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CreateEncomendaMail from '../jobs/CreateEncomendaMail';
import File from '../models/File';

class OrderController {
  async indexAll(req, res) {
    const orders = await Order.findAll();
    return res.json(orders);
  }

  async index(req, res) {
    // retornar encomendas do entregador :deliverymanId
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        end_date: null,
        canceled_at: null,
        /*  attributes: ['id', 'name', 'signature_id'],
        include: [
          {
            model: File,
            as: 'signature',
            attributes: ['name', 'path', 'url'],
          },
        ], */
      },
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!deliveryman) {
      return res
        .status(400)
        .json({ erro: `deliveryman ${req.body.deliveryman_id} não existe` });
    }

    const { id } = await Order.create(req.body);

    /* const encomenda = await Order.findByPk(id); */

    const order = await Order.findByPk(id, {
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

    // enviar email ao entregador avisando da encomenda vinculada a ele
    await Queue.add(CreateEncomendaMail.key, {
      order,
    });

    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ erro: 'order com este id nao existe' });
    }

    order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ erro: 'order informada nao existe' });
    }

    if (order.start_date) {
      return res.status(400).json({
        erro: `data de retirada já foi definida (${order.start_date}), sendo assim não é possivel deletar`,
      });
    }

    await order.destroy();

    return res.json();
  }
}

export default new OrderController();
