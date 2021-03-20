// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./MyToken.sol";

contract MyTokenSale{
    address payable admin;
    MyToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    //Sell event that fires when someone wants to buy tokensi.e when buyTokens function is called
    event Sell(
        address indexed _buyer,
        uint256 _amount
    );

    constructor(MyToken _tokenContract,uint _tokenPrice) public {
        //Assign an admin
           admin=msg.sender;
        //token contract
        tokenContract=_tokenContract;
        //token price
        tokenPrice=_tokenPrice;
    }


  function multiply(uint x, uint y) internal pure returns(uint z) {
    require(y == 0 || (z = x * y) / y == x, 'Failed multiplication');
  }
    function buyTokens(uint _noOfTokens) public payable{
        //require that value is equal to tokens
        require(msg.value==multiply(_noOfTokens,tokenPrice),"Amount should be equal to number of tokens multiplied by tokenPrice");
        //require that the contract has enough tokens
        require(tokenContract.balanceOf(address(this))>= _noOfTokens,"Can't buy more tokens than available");
        //require that the transfer is successfull
        require(tokenContract.transfer(msg.sender,_noOfTokens),"transfer is not successfull");
        //keep track of tokens sold
        tokensSold+=_noOfTokens;
        //trigger sell event
        emit Sell(msg.sender,_noOfTokens);
    }

    //function to end sale
    function endSale() public {
      //require admin
      require(msg.sender==admin,"Must be an  admin to end the sale");
       //Transfer remaining dapp token to admin
      require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))),"transfer failed");
      //destroy contract
      selfdestruct(admin);
    }
}