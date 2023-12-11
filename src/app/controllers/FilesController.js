import File from '../models/file';

class FilesControler {
  async create(req, res) {
    const { originalname, filename } = req.file;

    const file = await File.create({ name: originalname, path: filename });
    res.json(file);
  }
}

export default new FilesControler();
