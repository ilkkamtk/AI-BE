import express from 'express';

import dishRoute from './routes/dishRoute';

import {MessageResponse} from '../types/MessageTypes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (_req, res) => {
  res.json({
    message: 'routes: dishes',
  });
});

router.use('/dishes', dishRoute);

export default router;
