import {getAllDishes, addDish} from '../models/dishModel';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from '../../types/MessageTypes';
import {Dish} from '../../types/DBTypes';

const dishListGet = async (
  _req: Request,
  res: Response<Dish[]>,
  next: NextFunction,
) => {
  try {
    const dishes = await getAllDishes();
    res.json(dishes);
  } catch (error) {
    next(error);
  }
};

// TODO: create dishPost function to add new dish
const dishPost = async (
  req: Request<{}, {}, Omit<Dish, 'dish_id'>>,
  res: Response<MessageResponse, {file: string}>,
  next: NextFunction,
) => {
  try {
    const dish = req.body;
    dish.filename = res.locals.file;
    const result = await addDish(dish);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {dishListGet, dishPost};
