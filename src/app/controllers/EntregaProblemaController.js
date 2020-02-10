import * as Yup from 'yup';
import EntregaProblema from '../models/EntregaProblema';
import Encomenda from '../models/Encomenda';

class EntregaProblemaController {
  async index(req, res) {
    const entregas = await EntregaProblema.findAll({
      order: ['delivery_id'],
    });

    return res.json(entregas);
  }

  async problemasPorEntrega(req, res) {
    const entregas = await EntregaProblema.findAll({
      where: {
        delivery_id: req.params.entregaId,
      },
      order: ['created_at'],
    });
    return res.json(entregas);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const encomenda = await Encomenda.findByPk(req.params.entregaId);
    if (!encomenda) {
      return res.status(400).json({ erro: 'encomenda informada nao existe' });
    }

    const { delivery_id, description } = await EntregaProblema.create(req.body);

    return res.json({
      delivery_id,
      description,
    });
  }
}
export default new EntregaProblemaController();
