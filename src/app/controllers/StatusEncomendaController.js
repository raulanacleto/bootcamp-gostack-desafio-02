import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Encomenda from '../models/Encomenda';

class StatusEncomendaController {
  async retirar(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails - start_date nao informado' });
    }

    const encomenda = await Encomenda.findByPk(req.params.encomendaId);

    const date = req.body.start_date;
    const parsedDate = parseISO(date);
    console.log('startOfDay(parsedDate)', startOfDay(parsedDate));
    console.log('endOfDay(parsedDate)', endOfDay(parsedDate));

    const encomendas = await Encomenda.findAll({
      where: {
        deliveryman_id: encomenda.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (encomendas.length >= 5) {
      return res
        .status(400)
        .json({ erro: `Entregador nao pode ter mais que 5 retiradas por dia` });
    }

    // faz atualizacao do usuario com os dados da requisicao, dados do: req.body
    await encomenda.update(req.body);

    return res.json({
      encomenda,
    });
  }

  async finalizar(req, res) {
    return res.json();
  }
}
export default new StatusEncomendaController();
