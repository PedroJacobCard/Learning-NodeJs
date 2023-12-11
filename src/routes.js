import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import auth from './app/middlewares/auth';

import sessions from './app/controllers/SessionsController';
import customers from './app/controllers/customersController';
import contacts from './app/controllers/contactsController';
import users from './app/controllers/usersController';
import files from './app/controllers/FilesController';

const routes = new Router();
const upload = multer(multerConfig);

//sessions:
routes.post('/sessions', sessions.create);

//from this point forth the routes will be controlled
routes.use(auth);

//customers
routes.get('/customers', customers.index);
routes.get('/customers/:id', customers.show);
routes.post('/customers', customers.create);
routes.put('/customers/:id', customers.update);
routes.delete('/customers/:id', customers.destroy);

//contacts
routes.get('/customers/:customerId/contacts', contacts.index);
routes.get('/customers/:customerId/contacts/:id', contacts.show);
routes.post('/customers/:customerId/contacts', contacts.create);
routes.put('/customers/:customerId/contacts/:id', contacts.update);
routes.delete('/customers/:customerId/contacts/:id', contacts.destroy);

//users
routes.get('/users', users.index);
routes.get('/users/:id', users.show);
routes.post('/users', users.create);
routes.put('/users/:id', users.update);
routes.delete('/users/:id', users.destroy);

//files
routes.post('/files', upload.single('file'), files.create);

export default routes;
