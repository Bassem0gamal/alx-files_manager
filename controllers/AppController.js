import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static Homepage(req, res) {
    res.status(200).send('Hello my friend!');
  }

  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static async getStats(req, res) {
    const [users, files] = await Promise.all([
      dbClient.nbUsers(),
      dbClient.nbFiles(),
    ]);

    res.status(200).json({ users, files });
  }
}
