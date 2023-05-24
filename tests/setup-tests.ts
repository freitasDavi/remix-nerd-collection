import { getEnv } from "~/env.server";
import dtoenv from "dotenv";
import { installGlobals } from "@remix-run/node";

import "@testing-library/jest-dom";

installGlobals();

dtoenv.config();

global.ENV = getEnv();