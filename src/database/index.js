import Sequelize from 'sequelize';

import config from '../config/database';

import Customer from '../app/models/customer';
import Contact from '../app/models/contact';
import User from '../app/models/user';
import File from '../app/models/file';

const models = [Customer, Contact, User, File];

class Database {
  constructor() {
    this.connection = new Sequelize(config);
    this.init();
    this.associate();
  }

  init() {
    models.forEach((model) => model.init(this.connection));
  }

  associate() {
    models.forEach((model) => {
      if (model.associate) {
        model.associate(this.connection.models);
      }
    });
  }
}

export default new Database();
