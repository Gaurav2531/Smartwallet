// WalletApp.js
import React, { useState } from "react";
import { ethers } from "ethers";
import ProxyContractABI from "./contracts/ProxyContract.json";
import SmartWalletABI from "./contracts/SmartWallet.json";

const WalletApp = () => {
  const [provider, setProvider] = useState(null);
  const [proxyContract, setProxyContract] = useState(null);
  const [smartWallet, setSmartWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const connectMetaMask = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const signer = provider.getSigner();
    const networkId = await provider.getNetwork().then((n) => n.chainId);
    const proxyContractAddress = ProxyContractABI.networks[networkId].address;
    const smartWalletAddress = await signer.getAddress();

    const proxyContract = new ethers.Contract(proxyContractAddress, ProxyContractABI.abi, signer);
    setProxyContract(proxyContract);

    setWalletAddress(smartWalletAddress);
  };

  const createWallet = async () => {
    await proxyContract.createWallet();
    const walletAddress = await proxyContract.userWallets(walletAddress);
    const smartWallet = new ethers.Contract(walletAddress, SmartWalletABI.abi, provider);
    setSmartWallet(smartWallet);
  };

  const addFunds = async () => {
    if (!smartWallet) return;

    const amountToAdd = ethers.utils.parseEther("1"); // Example: Add 1 ether
    const tx = await provider.getSigner().sendTransaction({
      to: smartWallet.address,
      value: amountToAdd,
    });
    await tx.wait();
  };

  const transferFunds = async () => {
    if (!smartWallet || !transferRecipient || !transferAmount) return;

    const amountToSend = ethers.utils.parseEther(transferAmount);
    const tx = await smartWallet.transfer(transferRecipient, amountToSend);
    await tx.wait();
  };

  const destroyWallet = async () => {
    if (!smartWallet) return;

    const tx = await proxyContract.destroyWallet();
    await tx.wait();
    setSmartWallet(null);
  };

  return (
    <div>
      <button onClick={connectMetaMask}>Connect MetaMask</button>
      <button onClick={createWallet}>Create Wallet</button>
      <button onClick={addFunds}>Add Funds</button>
      <input
        type="text"
        placeholder="Recipient Address"
        value={transferRecipient}
        onChange={(e) => setTransferRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
      />
      <button onClick={transferFunds}>Transfer Funds</button>
      <button onClick={destroyWallet}>Destroy Wallet</button>
    </div>
  );
};

export default WalletApp;
