// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartWallet {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function delegateCall(address _target, bytes memory _data) external payable returns (bytes memory) {
        (bool success, bytes memory result) = _target.delegatecall(_data);
        require(success, "Delegate call failed");
        return result;
    }

    function destroy() external {
        require(msg.sender == owner, "Only owner can destroy");
        selfdestruct(payable(owner));
    }
}
