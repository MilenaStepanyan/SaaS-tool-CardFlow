import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();

const ormConfig: ConnectionOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DATABASE_USER ,
    password: process.env.DATABASE_PASSWORD ,
    database: process.env.DATABASE_NAME,
    entities: [join(__dirname, '../models/*.ts')],
    synchronize: true,
    logging: false
};

export default ormConfig;
