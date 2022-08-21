import "module-alias/register";
import dotenv from "dotenv";
import { initializeBot } from "~/core/bot";

dotenv.config();

initializeBot();
