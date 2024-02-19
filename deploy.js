const { ethers } = require("ethers");
const ProxyContract = artifacts.require("ProxyContract");
const SmartWallet = artifacts.require("SmartWallet");

async function deployContracts() {
  try {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    // Deploy ProxyContract
    const proxyContractInstance = await ProxyContract.new({ from: deployer });
    console.log("ProxyContract deployed at:", proxyContractInstance.address);

    // Deploy SmartWallet
    const smartWalletInstance = await SmartWallet.new(deployer, { from: deployer });
    console.log("SmartWallet deployed at:", smartWalletInstance.address);
    
    // Do any additional setup if needed

    return {
      proxyContractAddress: proxyContractInstance.address,
      smartWalletAddress: smartWalletInstance.address
    };
  } catch (error) {
    console.error("Error deploying contracts:", error);
  }
}

deployContracts();
