// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyToken{
    //initialize the total number of tokens 
    //initialize inside constructor, constructor runs only once when the smart contract is deployed
    //read the number the tokens
    uint noTokens;

    mapping(address=>uint) public balanceOf;

    constructor(uint _initialSupply) public {
       balanceOf[msg.sender]=_initialSupply;
       noTokens=_initialSupply;
    }

    function totalSupply() public view returns(uint){
        return noTokens;
     }
    
}