//import { Op } from 'sequelize';

import './database';

//import Contact from './app/models/Contact';
import Customer from './app/models/customer';

class Playground {
  static async play() {
    /*const data = await Customer.findAll({
      include: [
        {
          model: Contact,
          where: {
            id: {
              [Op.between]: [1, 5],
            },
          },
          required: false,
        },
      ],
      where: {
        [Op.or]: {
          name: {
            [Op.like]: '%r',
          },
          createdAt: {
            [Op.lte]: new Date(),
          },
        },
      },
      order: [['createdAt', 'DESC']],
      limit: 2,
      offset: 2 * 1 - 2,
    });
    //const data = await Customer.min('createdAt');
    const data = await Customer.scope({
      method: ['created', new Date(2023, 11, 10)],
    }).findAll();
    console.log(JSON.stringify(data, null, 2));*/

    //create a customer:
    /*const customer = await Customer.create({
      name: 'David Johnson',
      email: 'davidjohn@hotmail.com',
    });*/

    //update a customer:
    /*const customer = await Customer.findByPk(6);
    console.log('Antes', JSON.stringify(customer, null, 2));

    const newCustomer = await customer.update({
      email: 'johnsonda@hotmail.com',
    });

    console.log('Depois', JSON.stringify(newCustomer, null, 2));*/

    //delete a customer:
    /*const customer = await Customer.findByPk(6);

    customer.destroy();
    console.log('Depois', JSON.stringify(customer, null, 2));*/

    const customer = await Customer.findAll();
    console.log('Depois', JSON.stringify(customer, null, 2));
  }
}

Playground.play();
