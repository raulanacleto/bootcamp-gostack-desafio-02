import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateEncomendaMail {
  get key() {
    return 'CreateEncomendaMail';
  }

  async handle({ data }) {
    const { encomenda } = data;

    console.log('a fila executou');

    // os dados do context sao os dados que o 'cancellation.hbs' esta esperando
    await Mail.sendMail({
      to: `${encomenda.entregador.name} <${encomenda.entregador.email}>`,
      subject: 'Encomenda criada',
      template: 'criado',
      context: {
        entregador: encomenda.entregador.name,
        product: encomenda.product, // esses dados appointment.provider.name estao vindo do include que foi dado no metodo do delete
        cliente: encomenda.cliente.nome,
      },
    });
  }
}

export default new CreateEncomendaMail();
