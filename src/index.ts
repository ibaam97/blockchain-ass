import { OWNER_ADDRESS, OWNER_PRIVATE } from "./constants/ADDRESSES";
import Wallet from "./types/Wallet";
import ganache from "ganache-cli";
import ENVIRONMENTS from "./enum/ENVIRONMENTS.enum";
import GANACHE_ACCOUNTS from "./constants/GANACHE_ACCOUNTS";
import runServer from "./runServer";
import { NETWORK_URL } from "./constants/URLS";
import distributedAccountsFromJSON from "./accounts.json";
import dotenv from "dotenv";

dotenv.config();

const ganachePort = 8545;
const server = ganache.server({
  accounts: GANACHE_ACCOUNTS,
  port: ganachePort,
});

if (process.env.ENVIRONMENT === ENVIRONMENTS.dev) {
  server.listen(8545, function (err, blockchain) {
    const accounts = Object.values(blockchain.accounts).map<Wallet>(
      (account: any, index) => ({
        publicKey: account.address,
        privateKey: GANACHE_ACCOUNTS[index].secretKey,
      })
    );

    const ownerWallet: Wallet = accounts[0];
    runServer(
      ownerWallet,
      "http://localhost:" + ganachePort,
      accounts.slice(1).map((account) => account.publicKey)
    );
  });
} else {
  const ownerWallet: Wallet = {
    publicKey: OWNER_ADDRESS,
    privateKey: OWNER_PRIVATE,
  };

  runServer(ownerWallet, NETWORK_URL, distributedAccountsFromJSON);
}
