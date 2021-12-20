import { Contract } from "web3-eth-contract";
import Wallet from "../../types/Wallet";
import { TransactionReceipt } from "web3-core";

const deployContract = async (
  creatorWallet: Wallet,
  contract: Contract,
  bytecode,
  receiptCallback: (receipt: TransactionReceipt) => any
) => {
  const deployTransaction = contract.deploy({ data: bytecode });

  return deployTransaction
    .send({
      from: creatorWallet.publicKey,
      gas: 3000000,
    })
    .on("error", function (error) {
      console.log("error", error);
    })
    .on("transactionHash", function (transactionHash) {
      console.log("transactionHash", transactionHash);
    })
    .on("receipt", function (receipt) {
      console.log("receipt", receipt.contractAddress);
      receiptCallback(receipt);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log("confirmation", confirmationNumber);
    });
};

export default deployContract;
