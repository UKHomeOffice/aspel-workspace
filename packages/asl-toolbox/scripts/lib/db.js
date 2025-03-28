import db from '@asl/schema';
import {data, taskflow} from './config.js';

export const dataDb = db(data);
// noinspection JSUnusedGlobalSymbols
export const taskflowDb = db(taskflow);
