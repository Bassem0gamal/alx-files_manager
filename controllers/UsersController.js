import Queue from 'bull';
import crypto from 'crypto';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }
    try {
      const user = await dbClient.dataClient
        .db()
        .collection('users')
        .findOne({ email });
      if (user) {
        return res.status(400).send({ error: 'Already exist' });
      }
      const hashedPassword = crypto
        .createHash('sha1')
        .update(password)
        .digest('hex');
      const result = await dbClient.dataClient
        .db()
        .collection('users')
        .insertOne({ email, password: hashedPassword });
      const userQueue = new Queue('userQueue');
      userQueue.add({ userId: result.insertedId });
      return res.status(201).send({ email, id: result.insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
