import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';
import Recipient from '../app/models/Recipient';

const models = [User, Recipient];

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
