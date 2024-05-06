import express from 'express';
import {dishListGet, dishPost} from '../controllers/dishController';
import {body} from 'express-validator';
import {getAiImage, saveAiImage, validate} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(dishListGet)
  .post(
    body('dish_name').notEmpty().escape(),
    body('description').notEmpty().escape(),
    validate,
    getAiImage,
    saveAiImage,
    dishPost,
  );

export default router;
