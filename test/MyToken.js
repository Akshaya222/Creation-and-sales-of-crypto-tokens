const MyToken = artifacts.require("MyToken");

contract("MyToken",function(accounts){
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