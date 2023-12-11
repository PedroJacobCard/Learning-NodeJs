import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import * as Zod from 'zod';

import Contact from '../models/contact';
import Customer from '../models/customer';

class ContactsController {
  async index(req, res) {
    const {
      name,
      email,
      phone,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    const page = req.query.page || 1;
    const limit = req.query.limit || 25;

    let where = { customer_id: req.params.customerId };
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

    if (phone) {
      where = {
        ...where,
        phone,
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

    const data = await Contact.findAll({
      where,
      include: [
        {
          model: Customer,
          attributes: ['id', 'name', 'email'],
          required: true,
        },
      ],
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  //Recupera um Contact
  async show(req, res) {
    const id = parseInt(req.params.id);
    const contact = await Contact.findOne({
      where: { id },
      attributes: { exclude: ['customer_id', 'customerId'] },
      include: [
        {
          model: Customer,
          attributes: ['id', 'name', 'email'],
          required: true,
        },
      ],
    });
    const status = Contact ? 200 : 404;

    return res.status(status).json(contact);
  }

  //Cria um Contact
  async create(req, res) {
    const schema = Zod.object({
      name: Zod.string().min(1),
      email: Zod.string().email().min(1),
      phone: Zod.string().min(8),
    });

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Error on validating the schema' });
    }

    const contact = await Contact.create({
      customerId: req.params.customerId,
      ...req.body,
    });

    return res.status(201).json(contact);
  }

  //Altera um Contact
  async update(req, res) {
    const schema = Zod.object({
      name: Zod.string().optional(),
      email: Zod.string().email().optional(),
      phone: Zod.string().toUpperCase().optional(),
    });

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Error on validating the schema' });
    }

    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
      attributes: { exclude: ['customer_id', 'customerId'] },
    });

    if (!Contact) {
      return res.status(404).json();
    }

    await contact.update(req.body);

    return res.status(200).json(contact);
  }

  //Deleta um Contact
  async destroy(req, res) {
    const contact = await Contact.findOne({
      where: {
        customer_id: req.params.customerId,
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json();
    }

    await contact.destroy();

    return res.status(200).json();
  }
}

export default new ContactsController();
