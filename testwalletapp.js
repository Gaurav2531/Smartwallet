// TestSmartWallet.js
const ProxyContract = artifacts.require("ProxyContract");
const SmartWallet = artifacts.require("SmartWallet");

contract("SmartWallet", (accounts) => {
  let proxyContract;
  let smartWallet;

  beforeEach(async () => {
    proxyContract = await ProxyContract.new();
    await proxyContract.createWallet({ from: accounts[0] });
    const walletAddress = await proxyContract.userWallets(accounts[0]);
    smartWallet = await SmartWallet.at(walletAddress);
  });

  it("should create a smart wallet correctly", async () => {
    const owner = await smartWallet.owner();
    assert.equal(owner, accounts[0], "Owner should be the caller of createWallet");
  });

  it("should add funds to the wallet", async () => {
    const initialBalance = await web3.eth.getBalance(smartWallet.address);
    const amountToAdd = web3.utils.toWei("1", "ether");
    await smartWallet.sendTransaction({ from: accounts[0], value: amountToAdd });
    const finalBalance = await web3.eth.getBalance(smartWallet.address);
    assert.equal(finalBalance - initialBalance, amountToAdd, "Balance should increase by the added amount");
  });

  it("should transfer funds from the wallet to another address", async () => {
    const recipient = accounts[1];
    const initialBalanceRecipient = await web3.eth.getBalance(recipient);
    const amountToSend = web3.utils.toWei("0.5", "ether");
    await smartWallet.sendTransaction({ from: accounts[0], value: amountToSend });
    await smartWallet.transfer(recipient, amountToSend);
    const finalBalanceRecipient = await web3.eth.getBalance(recipient);
    assert.equal(finalBalanceRecipient - initialBalanceRecipient, amountToSend, "Recipient's balance should increase by the sent amount");
  });

  it("should destroy the wallet and recover funds", async () => {
    const initialBalanceOwner = await web3.eth.getBalance(accounts[0]);
    const initialBalanceWallet = await web3.eth.getBalance(smartWallet.address);
    await smartWallet.destroy({ from: accounts[0] });
    const finalBalanceOwner = await web3.eth.getBalance(accounts[0]);
    const finalBalanceWallet = await web3.eth.getBalance(smartWallet.address);
    assert.equal(finalBalanceWallet, "0", "Wallet balance should be zero after destruction");
    assert.isTrue(finalBalanceOwner - initialBalanceOwner > initialBalanceWallet, "Owner should recover funds after wallet destruction");
  });
});
