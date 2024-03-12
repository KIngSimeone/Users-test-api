import { SequelizeModuleOptions } from '@nestjs/sequelize';

const sequelizeConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: 17241,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadModels: true,
  synchronize: true,
};

export default sequelizeConfig;
