import { DataSource } from "typeorm";
import { User } from "./entities/user";

export const db = new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  synchronize: true,
  entities: [User],
  subscribers: [],
  migrations: []
});
