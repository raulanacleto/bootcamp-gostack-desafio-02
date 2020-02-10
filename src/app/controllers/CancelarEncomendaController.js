import Encomenda from '../models/Encomenda';
import EntregaProblema from '../models/EntregaProblema';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';
import Recipient from '../models/Recipient';
import Entregador from '../models/Entregador';

class CancelarEncomendaController {
  async cancelarPorIdProblema(req, res) {
    const entregaProblema = await EntregaProblema.findByPk(
      req.params.entregaProblemaId
    );

    if (!entregaProblema) {
      return res
        .status(400)
        .json({ erro: 'encomendaProblema informada nao existe ' });
    }

    const encomenda = await Encomenda.findByPk(entregaProblema.delivery_id, {
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
    if (!encomenda) {
      return res.status(400).json({ erro: 'encomenda informada nao existe ' });
    }

    encomenda.canceled_at = new Date();
    await encomenda.save();

    // enviar email para o entregador avisando do cancelamento
    await Queue.add(CancellationMail.key, {
      encomenda,
    });

    return res.json(encomenda);
  }
}

export default new CancelarEncomendaController();
