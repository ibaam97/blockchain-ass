import path from "path";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { GANACHE, NETWORK_URL } from "../../constant/URLS";
import Wallet from "../../types/Wallet";
import compileSol from "./compileSol";
import deployContract from "./deployContract";
import { TransactionReceipt } from "web3-core";
import ETH_UNITS from "../../constant/ETH_UNITS";
import BigNumber from "bignumber.js";

class ERC20Contract {
  constructor(
    private owerWallet: Wallet,
    filepath: string,
    network_url: string = NETWORK_URL
  ) {

    const compiledContract = compileSol(filepath, "erc20");

    this.abi = compiledContract.contracts.erc20.myToken.abi;

    this.bytecode =
      compiledContract.contracts.erc20.myToken.evm.bytecode.object;

    this.web3 = new Web3(new Web3.providers.HttpProvider(network_url));

    this.web3.eth.accounts.wallet.add(owerWallet.privateKey);

    this.contract = new this.web3.eth.Contract(this.abi);
  }

  contract: Contract;

  bytecode;

  abi;

  contractAddress: string;

  web3: Web3;

  getTotalSupply = async () => {
    let totSupply = await this.contract.methods.totalSupply().call();
    return totSupply;
  };

  getName = async () => {
    let name = await this.contract.methods.name().call();
    return name;
  };

  getBalanceOfAccount = async (account) => {
    let bal = await this.contract.methods
      .balanceOf(this.owerWallet.publicKey)
      .call();
    return bal;
  };

  getDecimals = async () => {
    let decimals = await this.contract.methods.decimals().call();
    return decimals;
  };

  getSymbol = async () => {
    let symbol = await this.contract.methods.symbol().call();
    return symbol;
  };

  transferFromOwner = async (toAddress: string, amount: number) => {
    const transaction = await this.contract.methods
      .transfer(toAddress, new BigNumber(amount * ETH_UNITS.WEI))
      .send({
        nonce: this.web3.utils.toHex((await this.web3.eth.getTransactionCount(this.owerWallet.publicKey))),
        from: this.owerWallet.publicKey,
        gasLimit: this.web3.utils.toHex(500000),
        gasPrice: this.web3.utils.toHex(this.web3.utils.toWei("100", "gwei")),
      });
    return transaction;
  };

  deploy = () => {
    return deployContract(
      this.owerWallet,
      this.contract,
      this.bytecode,
      (receipt) => {
        this.contractAddress = receipt.contractAddress;
        this.contract = new this.web3.eth.Contract(
          this.abi,
          this.contractAddress
        );
      }
    );
  };

  waitForDeployment = (callback: () => any, interval = 1000) => {
    const intervalId = setInterval(() => {
      if (this.contractAddress) {
        clearInterval(intervalId);
        callback();
      }
    }, interval);
  };
}

export default ERC20Contract;
