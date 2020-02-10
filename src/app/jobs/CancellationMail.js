import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { encomenda } = data;

    console.log('a fila executou');

    // os dados do context sao os dados que o 'cancellation.hbs' esta esperando
    await Mail.sendMail({
      to: `${encomenda.entregador.name} <${encomenda.entregador.email}>`,
      subject: 'Entrega da encomenda cancelada',
      template: 'cancellation',
      context: {
        entregador: encomenda.entregador.name,
        product: encomenda.product, // esses dados appointment.provider.name estao vindo do include que foi dado no metodo do delete
        cliente: encomenda.cliente.nome,
        dataCancelamento: encomenda.canceled_at,
      },
    });
  }
}

export default new CancellationMail();
