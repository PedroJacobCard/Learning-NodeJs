import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import * as Zod from 'zod';
import Customer from '../models/customer';
import Contact from '../models/contact';

class CustomersController {
  // listagem de customers
  async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = {};
    let order = [];

    if (name) {
      where = {
        ...where,
        name: {
          [Op.iLike]: name,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.iLike]: email,
        },
      };
    }

    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(',').map((item) => item.toUpperCase().join()),
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdBefore),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdAfter),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedAfter),
        },
      };
    }

    if (sort) {
      order = sort.split(',').map((item) => item.split(':'));
    }

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  //Recupera um customer
  async show(req, res) {
    const id = parseInt(req.params.id);
    const customer = await Customer.findOne({
      where: { id },
    }); /*customers.find((cus) => cus.id === id);*/
    const status = customer ? 200 : 404;

    return res.status(status).json(customer);
  }

  //Cria um customer
  async create(req, res) {
    const schema = Zod.object({
      name: Zod.string().min(1),
      email: Zod.string().email().min(1),
      status: Zod.string().toUpperCase().optional(),
    });

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Error on validating the schema' });
    }

    const customer = await Customer.create(req.body);

    return res.status(201).json(customer);
  }

  //Altera um customer
  async update(req, res) {
    const schema = Zod.object({
      id: Zod.number().int().optional(),
      name: Zod.string().optional(),
      email: Zod.string().email().optional(),
      status: Zod.string().toUpperCase().optional(),
    });

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Error on validating the schema' });
    }

    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json();
    }

    await customer.update(req.body);

    return res.status(200).json(customer);
  }

  //Deleta um customer
  async destroy(req, res) {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
      return res.status(404).json();
    }

    await customer.destroy();

    return res.status(200).json();
  }
}

export default new CustomersController();
