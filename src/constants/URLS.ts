import ENVIRONMENTS from "../enum/ENVIRONMENTS.enum";

import dotenv from "dotenv";

dotenv.config();

export const INFURA =
  `https://ropsten.infura.io/v3/${process.env.INFURA_TOKEN}`;

export const GANACHE = "http://127.0.0.1:7545";

export const NETWORK_URL =
  process.env.ENVIRONMENT === ENVIRONMENTS.dev ? GANACHE : INFURA;
