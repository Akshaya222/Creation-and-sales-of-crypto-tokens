// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyToken{
    //initialize the total number of tokens 
    //initialize inside constructor, constructor runs only once when the smart contract is deployed
    //read the number the tokens
    uint noTokens;
    string public name="MyToken";
    string public symbol="MT";
    string public standard="MyToken New";

    event Transfer(
       address indexed _from,
       address indexed _to,
       uint256 _value
    );
   mapping(address=>uint) public balanceOf;

    constructor(uint _initialSupply) public {
       balanceOf[msg.sender]=_initialSupply;
       noTokens=_initialSupply;
    }

    function totalSupply() public view returns(uint){
        return noTokens;
     } 

     function transfer(address _to,uint256 _value) public returns(bool success){
         require(balanceOf[msg.sender]>= _value);
         balanceOf[msg.sender]=balanceOf[msg.sender] - _value;
         balanceOf[_to]=balanceOf[_to]+_value;
        //emmiting Transfer event
         emit Transfer(msg.sender, _to, _value);

         return true;
     }

}