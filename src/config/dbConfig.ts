import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

import User from "../models/user";
import RefreshToken from "../models/refreshToken";

const sequelize: any = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logging: false,
  benchmark: true,
  models: [User, RefreshToken],
});

export default sequelize;
