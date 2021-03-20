const MyTokenSale = artifacts.require("MyTokenSale");
const MyToken=artifacts.require("MyToken");
// tokenPrice is 0.001 Ether, but we cannot use float values in solidity,
//wei i the smallest subunit of eth, so we use wei here
const tokenPrice= 1000000000000000 //in wei
var numberOfTokens=10;
var tokensAvailable=750000  //75% of all tokens for token sale;
var value=tokenPrice * numberOfTokens;
contract("MyTokenSale",function(accounts){
    var tokenSaleInstance;
    var tokenInstance;
    it("Initializes the contract with correct values",function(){
      return MyTokenSale.deployed().then(function(instance){ 
       tokenSaleInstance=instance;
       return tokenSaleInstance.address;
    }).then(function(address){
        assert.notEqual(address,'0x0',"contract has the address")
        return tokenSaleInstance.tokenContract();
    }).then(function(address){
        assert.notEqual(address,'0x0',"contract has the token contract address");
        return tokenSaleInstance.tokenPrice();
    }).then(function(price){
        assert.equal(price,tokenPrice,'token price is correct')
    })
   })

   it("facilitates token buying",function(){
       return MyToken.deployed().then(function(instance){
             tokenInstance=instance;
             return MyTokenSale.deployed();
       }).then(function(instance){
        tokenSaleInstance=instance;
        return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailable,{from:accounts[0]});
       }).then(function(receipt){
        return tokenSaleInstance.buyTokens(numberOfTokens,{from:accounts[1],value:value})
       }).then(function(receipt){
        assert.equal(receipt.logs.length,1,"triggers one event");
        assert.equal(receipt.logs[0].event,'Sell',"Should be the Sell event");
        assert.equal(receipt.logs[0].args._buyer,accounts[1],"Logs the account that purchased the tokens");
        assert.equal(receipt.logs[0].args._amount,numberOfTokens,"Logs the number of tokens purchased");
           return tokenSaleInstance.tokensSold();
       }).then(function(amount){
           assert.equal(amount.toNumber(),numberOfTokens,"Increments the number of tokens sold");
           return tokenInstance.balanceOf(accounts[1]);
       }).then(function(balance){
           assert.equal(balance.toNumber(),numberOfTokens,"Increments the balance of buyer");
           return tokenInstance.balanceOf(tokenSaleInstance.address);
       }).then(function(balance){
           assert.equal(balance.toNumber(),tokensAvailable-numberOfTokens,"decrements the balance of seller")
           //try to buy token different from the ether value
           return tokenSaleInstance.buyTokens(numberOfTokens,{from:accounts[1],value:1});
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert")>=0,"message.value must be equal number of tokens in wei")
          return tokenSaleInstance.buyTokens(800000,{from:accounts[3],value:numberOfTokens*tokenPrice})
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert")>=0,"Can't buy more than available tokens")
       })
   })

   it("ends token sale",function(){
       MyTokenSale.deployed().then(function(instance){
           tokenSaleInstance=instance;
           //try to end sale from account other than the admin
           return tokenSaleInstance.endSale({from:accounts[1]});
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert">=0,"must be admin to end sale"))
           return tokenSaleInstance.endSale({from:accounts[0]});
       }).then(function(receipt){
           return tokenInstance.balanceOf(accounts[0]);
       }).then(function(balance){
           assert.equal(balance.toNumber(),999990,"returns all unsold tokens to admin");
           return tokenSaleInstance.tokenPrice();
       }).then(function(price){
           assert.equal(price.toNumber(),0,"token price was reset")
       })
   })
})