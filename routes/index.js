import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

router.get('/', AppController.Homepage);
router.get('/status', AppController.Status);
router.get('/stats', AppController.Stats);

export default router;
