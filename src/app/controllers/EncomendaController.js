import * as Yup from 'yup'; // serve pra fazer validacoes, exemplo: se digitou nome de usuario no campo 'name'
import Encomenda from '../models/Encomenda';
import Entregador from '../models/Entregador';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CreateEncomendaMail from '../jobs/CreateEncomendaMail';
import File from '../models/File';

class EncomendaController {
  async indexAll(req, res) {
    const encomendas = await Encomenda.findAll();
    return res.json(encomendas);
  }

  async index(req, res) {
    // retornar encomendas do entregador :entregadorId
    const encomendas = await Encomenda.findAll({
      where: {
        deliveryman_id: req.params.entregadorId,
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

    return res.json(encomendas);
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

    const entregador = await Entregador.findByPk(req.body.deliveryman_id);

    if (!entregador) {
      return res
        .status(400)
        .json({ erro: `entregador ${req.body.deliveryman_id} não existe` });
    }

    const { id } = await Encomenda.create(req.body);

    /* const encomenda = await Encomenda.findByPk(id); */

    const encomenda = await Encomenda.findByPk(id, {
      include: [
        {
          model: Recipient,
          as: 'cliente',
          attributes: ['id', 'nome'],
        },
        {
          model: Entregador,
          as: 'entregador',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    // enviar email ao entregador avisando da encomenda vinculada a ele
    await Queue.add(CreateEncomendaMail.key, {
      encomenda,
    });

    return res.json(encomenda);
  }

  async update(req, res) {
    const encomenda = await Encomenda.findByPk(req.params.id);

    if (!encomenda) {
      return res.status(400).json({ erro: 'encomenda com este id nao existe' });
    }

    encomenda.update(req.body);

    return res.json(encomenda);
  }

  async delete(req, res) {
    const encomenda = await Encomenda.findByPk(req.params.id);

    if (!encomenda) {
      return res.status(400).json({ erro: 'encomenda informada nao existe' });
    }

    if (encomenda.start_date) {
      return res.status(400).json({
        erro: `data de retirada já foi definida (${encomenda.start_date}), sendo assim não é possivel deletar`,
      });
    }

    await encomenda.destroy();

    return res.json();
  }
}

export default new EncomendaController();
