import { Router } from 'express';
import {
  healthCheck,
  databaseHealthCheck,
  fullHealthCheck,
} from '../controllers/health.controller';

const router = Router();

router.get('/', healthCheck);
router.get('/db', databaseHealthCheck);
router.get('/full', fullHealthCheck);

export default router;
