import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO, format, getTime } from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';

class StatusEncomendaController {
  async retirar(req, res) {
    const schema = Yup.object().shape({
      // start_date: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails - start_date nao informado' });
    }

    const order = await Order.findByPk(req.params.orderId);

    // para verificar se a retirada esta sendo feita entre as 08:00 e 20:00
    const oitoHoras = new Date().setHours(8);
    const vinteHoras = new Date().setHours(20);
    console.log('oitohoras', oitoHoras);
    console.log('vinteHoras', vinteHoras);

    const dataAtual = getTime(new Date());
    console.log('dataAtual', getTime(new Date()));

    if (dataAtual >= vinteHoras || dataAtual <= oitoHoras) {
      return res
        .status(400)
        .json({ erro: 'retirada fora do horario permitido' });
    }

    // monta dataAtual em formato Exemplo: 2020-02-11T03:00:00.000Z
    const date = format(Date.now(), "yyyy-MM-dd'T'HH:mm:ssxxx");
    console.log('dataAtual', date);
    const parsedDate = parseISO(date);
    console.log('startOfDay(parsedDate)', startOfDay(parsedDate));
    console.log('endOfDay(parsedDate)', endOfDay(parsedDate));

    // verificar quantas orders o entregador ja retirou no dia
    const orders = await Order.findAll({
      where: {
        deliveryman_id: order.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (orders.length >= 5) {
      return res
        .status(400)
        .json({ erro: `Entregador nao pode ter mais que 5 retiradas por dia` });
    }

    // faz atualizacao do usuario com os dados da requisicao, dados do: req.body
    await order.update(req.body);

    return res.json({
      order,
    });
  }

  async finalizar(req, res) {
    return res.json();
  }
}
export default new StatusEncomendaController();
