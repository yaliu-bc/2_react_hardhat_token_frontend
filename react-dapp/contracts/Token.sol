//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    address owner;
    string name = "DD Token";
    string symbol = "DDT";
    uint supply = 1000000;
    mapping(address => uint) balances;

    constructor(){
        owner = msg.sender;
        balances[owner] = supply;
    }

    event Transfer(address from, address to, uint amount);

    function getName() view public returns (string memory){
        return name;
    }

    function getSymbol() view public returns (string memory){
        return symbol;
    }

    function getSupply() view public returns(uint){
        return supply;
    }

    function balanceOf(address account) view public returns (uint){
        return balances[account];
    }

    function transfer(address from, address to, uint amount) public returns(bool){
        require(balances[from] > amount);

        emit Transfer(from, to, amount);

        balances[from] -= amount;
        balances[to] += amount;

        return true;
    }

}
