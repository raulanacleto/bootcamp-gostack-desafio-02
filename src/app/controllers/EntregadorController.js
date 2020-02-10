import * as Yup from 'yup'; // serve pra fazer validacoes, exemplo: se digitou nome de usuario no campo 'name'
import Entregador from '../models/Entregador';

class EntregadorController {
  async index(req, res) {
    const entregadores = await Entregador.findAll();

    return res.json(entregadores);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, name, avatar_id, email } = await Entregador.create(req.body);

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const entregador = await Entregador.findByPk(req.params.id);

    // verifica se esta alterando email, se nao tiver alterando nao executa o bloco
    if (email && email !== entregador.email) {
      const entregadorExists = await Entregador.findOne({
        where: { email: req.body.email },
      });
      if (entregadorExists) {
        return res.status(400).json({ error: 'usuario ja existe' });
      }
    }

    // faz atualizacao do usuario com os dados da requisicao, dados do: req.body
    const { id, name } = await entregador.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const entregador = await Entregador.findByPk(req.params.id);

    if (!entregador) {
      return res.status(400).json({ erro: 'entregador informado nao existe' });
    }

    await entregador.destroy();

    return res.json();
  }
}

export default new EntregadorController();
