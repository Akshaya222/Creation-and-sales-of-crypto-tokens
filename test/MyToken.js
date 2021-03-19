const MyToken = artifacts.require("MyToken");

contract("MyToken",function(accounts){
    it("Initializes the contract with correct values",function(){
        return MyToken.deployed().then(function(instance){ 
       tokenInstance=instance;
       return tokenInstance.name();
    }).then(function(name){
        assert.equal(name,"MyToken","checks the name of token is MyToken");
        return tokenInstance.symbol();
    }).then(function(symbol){
        assert.equal(symbol,"MT","checks the symbol of token is MyToken");
        return tokenInstance.standard();
    }).then(function(standard){
        assert.equal(standard,"MyToken New","checks the standard value is MYToken New")
    })
  })

    it("Initializing the total supply on deployment",function(){
        return MyToken.deployed().then(function(instance){
            tokenInstance=instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,"sets the total supply to 1000000")
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),1000000,"it allocated the initial supply to owner")
        })
    })

})