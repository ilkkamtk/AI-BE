/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import sharp from 'sharp';
import {ErrorResponse} from './types/MessageTypes';
import CustomError from './classes/CustomError';
import {FieldValidationError, validationResult} from 'express-validator';
import https from 'https';
import fs from 'fs';
import OpenAI from 'openai';
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  // console.error('errorHandler', chalk.red(err.stack));
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const makeThumbnail = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log(res.locals.file);
    await sharp(res.locals.file)
      .resize(160, 160)
      .png()
      .toFile('thumb_' + res.locals.file);
    next();
  } catch (error) {
    next(new CustomError('Thumbnail not created', 500));
  }
};

const getAiImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Name of dish: ${req.body.dish_name}. The description of the dish: ${req.body.description}. Create a photorealistic image of the dish for a menu of a fine dining restaurant. Dont add any text to the image.`,
      n: 1,
      size: '1024x1024',
    });
    res.locals.url = response.data[0].url;
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

const saveAiImage = async (req: Request, res: Response, next: NextFunction) => {
  const imageName = `./uploads/${req.body.dish_name}.png`;
  const file = fs.createWriteStream(imageName);
  if (!res.locals.url) {
    res.locals.file = 'default.png';
    next();
    return;
  }

  https
    .get(res.locals.url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Image downloaded from ${res.locals.url}`);
      });
    })
    .on('error', (err) => {
      fs.unlink(imageName, () => {
        console.error(`Error downloading image: ${err.message}`);
      });
    });
  res.locals.file = imageName;
  next();
};

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${(error as FieldValidationError).path}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

export {
  notFound,
  errorHandler,
  makeThumbnail,
  getAiImage,
  saveAiImage,
  validate,
};