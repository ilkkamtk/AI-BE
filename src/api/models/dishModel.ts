import {promisePool} from '../../lib/db';
import CustomError from '../../classes/CustomError';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '../../types/MessageTypes';
import {Dish} from '../../types/DBTypes';

const getAllDishes = async (): Promise<Dish[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Dish[]>(
    `
    SELECT * FROM ai_dish;
    `,
  );
  return rows;
};

const addDish = async (
  data: Omit<Dish, 'dish_id'>,
): Promise<MessageResponse> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    `
    INSERT INTO ai_dish (dish_name, description, filename)
    VALUES (?, ?, ?);
    `,
    [data.dish_name, data.description, data.filename],
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Dish not added', 400);
  }
  return {message: 'Dish added'};
};

export {getAllDishes, addDish};
