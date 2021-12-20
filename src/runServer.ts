import path from "path";
import { ERC20Contract } from "./etherium";
import Wallet from "./types/Wallet";
import express from "express";
import TOKEN_SUPPLY from "./constants/TOKEN_SUPPLY";

const runServer = (
  ownerWallet: Wallet,
  chain_url: string,
  distributeAddresses: string[]
) => {
  const Contract = new ERC20Contract(
    ownerWallet,
    path.join(__dirname, "./etherium/solidity/erc20.sol"),
    chain_url
  );

  Contract.deploy();

  const contractWaitMiddleware = function (req, res, next) {
    Contract.waitForDeployment(async () => {
      next();
    });
  };

  const app = express();

  app.use(express.json());

  app.use(contractWaitMiddleware);

  const port = 8080;

  app.get("/symbol", async (req, res) => {
    Contract.waitForDeployment(async () =>
      res.send(await Contract.getSymbol())
    );
  });

  app.post("/transfer", async (req, res) => {
    let account_to = req.body.account_to;
    let amount = req.body.amount;
    res.send(await Contract.transferFromOwner(account_to, amount));
  });

  app.get("/distribute", async (req, res) => {
    const responses = [];

    for (const address of distributeAddresses) {
      const response = await Contract.transferFromOwner(
        address,
        TOKEN_SUPPLY * 0.05
      );
      responses.push(response);
    }

    res.send(responses);
  });
  app.listen(port, () => console.log(`listening on port ${port}...`));
};

export default runServer;
