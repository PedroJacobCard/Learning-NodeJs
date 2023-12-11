import { Op } from 'sequelize';
import { parseISO } from 'date-fns';
import * as Zod from 'zod';

import User from '../models/user';

import DummyJob from '../jobs/Dummy';
import Queue from '../../lib/Queue';
import WelcomeEmailJob from '../jobs/WelcomeEmailJob';

class UsersController {
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

    const data = await User.findAll({
      attributes: { exclude: ['password', 'password_hash'] },
      where,
      order,
      limit,
      offset: limit * page - limit,
    });

    return res.json(data);
  }

  async show(req, res) {
    const id = parseInt(req.params.id, {
      attributes: { exclude: ['password', 'password_hash'] },
    });
    const user = await User.findOne({
      where: { id },
    });
    const status = user ? 200 : 404;

    return res.status(status).json(user);
  }

  async create(req, res) {
    const { password, passwordConfirmation } = req.body;

    const schema = Zod.object({
      name: Zod.string().min(1),
      email: Zod.string().email().min(1),
      status: Zod.string().toUpperCase().optional(),
      password: Zod.string().min(8),
      passwordConfirmation: Zod.string().refine(
        (data) => data.password === data.passwordConfirmation,
        {
          message: "Password doesn't match",
          path: ['passwordConfirmation'],
        }
      ),
    });

    const validationResult = schema.safeParse(req.body);

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password is too short' });
    }

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Error on validating the schema' });
    }

    if (password !== passwordConfirmation) {
      return res
        .status(400)
        .json({ error: "Password and password confirmation don't match" });
    }

    const { id, name, email, file_id, status, createdAt, updatedAt } =
      await User.create(req.body);

    await Queue.add(DummyJob.key, { message: 'Hello, Jobs!' });
    await Queue.add(WelcomeEmailJob.key, { email, name });

    return res
      .status(201)
      .json({ id, name, email, file_id, status, createdAt, updatedAt });
  }

  async update(req, res) {
    const { oldPassword, password, passwordConfirmation } = req.body;

    const schema = Zod.object({
      name: Zod.string().optional(),
      email: Zod.string().email().optional(),
      status: Zod.string().toUpperCase().optional(),
      oldPassword: Zod.string().min(8),
      password: Zod.string()
        .min(8)
        .refine((data) => data.oldPassword === data.password)
        .optional(),
      passwordConfirmation: Zod.string()
        .refine((data) => data.password === data.passwordConfirmation, {
          message: "Password doesn't match",
          path: ['passwordConfirmation'],
        })
        .optional(),
    });

    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: 'Error on validating the schema' });
    }

    if (password !== passwordConfirmation) {
      return res
        .status(400)
        .json({ error: "Password and password confirmation don't match" });
    }

    const user = await User.findByPk(req.params.id);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({ error: "Password and old password don't match" });
    }

    await user.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    return res.status(200).json(user);
  }

  async destroy(req, res) {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    return res.status(200).json(user);
  }
}

export default new UsersController();
