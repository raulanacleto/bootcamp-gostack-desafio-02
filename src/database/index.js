import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';
import Entregador from '../app/models/Entregador';
import Encomenda from '../app/models/Encomenda';
import File from '../app/models/File';
import EntregaProblema from '../app/models/EntregaProblema';

const models = [User, Recipient, Entregador, Encomenda, File, EntregaProblema];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    console.log('Models:', models);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
