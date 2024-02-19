// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ProxyContract is Ownable {
    mapping(address => address) public userWallets;

    event WalletCreated(address indexed user, address wallet);
    event WalletDestroyed(address indexed user, address wallet);

    function createWallet() external {
        require(userWallets[msg.sender] == address(0), "Wallet already exists");
        
        // Create new smart wallet contract
        address newWallet = address(new SmartWallet(msg.sender));
        userWallets[msg.sender] = newWallet;

        emit WalletCreated(msg.sender, newWallet);
    }

    function destroyWallet() external {
        address userWallet = userWallets[msg.sender];
        require(userWallet != address(0), "Wallet does not exist");

        // Destroy wallet
        SmartWallet(userWallet).destroy();
        userWallets[msg.sender] = address(0);

        emit WalletDestroyed(msg.sender, userWallet);
    }
}
