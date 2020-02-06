import * as Yup from 'yup'; // serve pra fazer validacoes, exemplo: se digitou nome de usuario no campo 'name'

import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // verifica se o usuario existe
    if (!user) {
      return res.status(400).json({ error: 'user not found' });
    }

    // se a senha nao bater, nao permite logar.
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'password does not math' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
