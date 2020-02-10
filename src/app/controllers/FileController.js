import File from '../models/File';
import Encomenda from '../models/Encomenda';

class FileController {
  async store(req, res) {
    const encomenda = await Encomenda.findByPk(req.params.encomendaId);

    if (!encomenda) {
      return res.status(400).json({ error: 'encomenda informada nao existe' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    encomenda.end_date = new Date();
    encomenda.signature_id = file.id;

    await encomenda.save();

    return res.json(file);
  }
}

export default new FileController();
