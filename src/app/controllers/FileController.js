import File from '../models/File';
import Order from '../models/Order';

class FileController {
  async store(req, res) {
    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(400).json({ error: 'order informada nao existe' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    order.end_date = new Date();
    order.signature_id = file.id;

    await order.save();

    return res.json(file);
  }
}

export default new FileController();
