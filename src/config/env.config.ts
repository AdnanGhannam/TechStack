import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config();
const env = cleanEnv(process.env, {
    PORT: port(),
    SECRET: str(),
    MONGO_URI: str(),
});

export default env;