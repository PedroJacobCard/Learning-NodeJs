import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        status: Sequelize.ENUM('ACTIVE', 'ARCHIVED'),
      },
      {
        /*scopes: {
          actives: {
            where: { status: 'ACTIVE' },
          },
          order: ['createdAt', 'DESC'],
        },
        created(date) {
          return {
            where: {
              createdAt: date,
            },
          };
        },*/
        sequelize,
        name: {
          singular: 'customer',
          plural: 'customers',
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Contact);
  }
}

export default Customer;
