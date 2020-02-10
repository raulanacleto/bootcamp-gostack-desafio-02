import Sequelize, { Model } from 'sequelize';

class EntregaProblema extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Encomenda, {
      foreignKey: 'delivery_id',
      as: 'encomenda',
    });
  }
}

export default EntregaProblema;
