import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();
const env = cleanEnv(process.env, {
    PORT: port(),
    DB_HOST: str(),
    DB_PORT: port(),
    DB_NAME: str(),
    SECRET: str(),
    MONGO_URI: str(),
});

export default env;