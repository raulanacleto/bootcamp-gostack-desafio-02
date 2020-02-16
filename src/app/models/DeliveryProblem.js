import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(sequelize) {
    super.init(
      {
        // id: {
        //   type: Sequelize.INTEGER,
        //   primaryKey: true,
        // },
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'delivery_id',
      as: 'order',
    });
  }
}

export default DeliveryProblem;
