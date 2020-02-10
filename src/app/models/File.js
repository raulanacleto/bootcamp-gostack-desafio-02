import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL, // campos virtuais serverm para exibir no json, eles nao existem no banco de dados
          get() {
            return `${process.env.APP_URL}/encomendas/${this.path}`;
          },
        },
      },
      { sequelize }
    );

    return this;
  }
}

export default File;
