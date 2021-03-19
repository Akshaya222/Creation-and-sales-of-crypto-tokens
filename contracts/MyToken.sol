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
    
    event Approval(
      address indexed _owner,
      address indexed _spender,
      uint256 _value
    );


   mapping(address=>uint) public balanceOf;
   mapping(address=>mapping(address=>uint256)) public allowance;

    constructor(uint _initialSupply) public {
       balanceOf[msg.sender]=_initialSupply;
       noTokens=_initialSupply;
    }

    function totalSupply() public view returns(uint){
        return noTokens;
     } 

     function transfer(address _to,uint256 _value) public returns(bool success){
         require(balanceOf[msg.sender]>= _value,"Invalid amount");
         balanceOf[msg.sender]=balanceOf[msg.sender] - _value;
         balanceOf[_to]=balanceOf[_to]+_value;
        //emmiting Transfer event
         emit Transfer(msg.sender, _to, _value);

         return true;
     }

     function approve(address _spender,uint256 _value) public returns(bool success) {
       //allowance
       allowance[msg.sender][_spender]=_value;
       //Approve event
      emit Approval(msg.sender, _spender ,_value);
       return true;
     }

     function transferFrom(address _sender, address _recipient, uint256 _amount) public returns(bool success){
    //require _from has enough tokens
   require(balanceOf[_sender]>=_amount,"Insufficient balance");
   //require has enough allowance
   require(allowance[_sender][msg.sender]>=_amount,"Cannot transfer more than approved amount");
     //change the balance
   balanceOf[_sender]-=_amount;
   balanceOf[_recipient]+=_amount;
   //update the allowance
   allowance[_sender][msg.sender]-=_amount;
    //transfer event
    emit  Transfer(_sender, _recipient, _amount);
    //return a boolean
          return true;
     }

}