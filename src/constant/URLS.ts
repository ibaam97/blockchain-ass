import ENVIRONMENTS from "../enum/ENVIRONMENTS.enum";

export const INFURA =
  "https://ropsten.infura.io/v3/18504d9eae484de28cc710c5e7ac954b";

export const GANACHE = "http://127.0.0.1:7545";

export const NETWORK_URL =
  process.env.ENVIRONMENT === ENVIRONMENTS.dev ? GANACHE : INFURA;
