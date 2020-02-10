import Sequelize, { Model } from 'sequelize';

class Entregador extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        avatar_id: Sequelize.INTEGER,
        email: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

export default Entregador;
