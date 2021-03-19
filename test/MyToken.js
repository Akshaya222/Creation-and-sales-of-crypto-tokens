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

    it("transfers token ownership",function(){
        return MyToken.deployed().then(function(instance){
            tokenInstance=instance; 
            //Test require statement first by transferring something larger than sender's balance i.e owner balance
           return tokenInstance.transfer.call(accounts[1],9999999999);
       }).then(assert.fail).catch(function(error){
           assert(error.message.indexOf("revert")>=0,"Error message must contain revert");
            return tokenInstance.transfer.call(accounts[1],250000,{from:accounts[0]});
        }).then(function(success){
            assert.equal(success,true,"it returns true");
            return tokenInstance.transfer(accounts[1],250000,{from:accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"triggers one event");
            assert.equal(receipt.logs[0].event,'Transfer',"Should be the Transfer event");
            assert.equal(receipt.logs[0].args._from,accounts[0],"Logs the account,tne tokens are transferred from");
            assert.equal(receipt.logs[0].args._to,accounts[1],"Logs the account,the tokens are transferred to");
            assert.equal(receipt.logs[0].args._value,250000,"Logs the transferred amount");
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),250000,"adds the amount to the receiving account");
            return tokenInstance.balanceOf(accounts[0])
        }).then(function(balance){
            assert.equal(balance.toNumber(),750000,"deducts the amount from the sending account")
        })
    })

    it("approves tokens for delegated tranfer",function(){
        return MyToken.deployed().then(function(instance){
            tokenInstance=instance; 
          return tokenInstance.approve.call(accounts[1],100);
    }).then(function(success){
        assert.equal(success,true,"it returns true");
        return tokenInstance.approve(accounts[1],100,{from:accounts[0]});
    }).then(function(receipt){
        //args parameters here are of approval event
        assert.equal(receipt.logs.length,1,"triggers one event");
        assert.equal(receipt.logs[0].event,"Approval","should be the Approval event")
        assert.equal(receipt.logs[0].args._owner,accounts[0],"Logs the account,tne tokens are authorized from");
        assert.equal(receipt.logs[0].args._spender,accounts[1],"Logs the account,the tokens are authorized to");
        assert.equal(receipt.logs[0].args._value,100,"Logs the transfer amount");
        return tokenInstance.allowance(accounts[0],accounts[1]);
    }).then(function(allowance){
        assert.equal(allowance.toNumber(),100,"stores the allowance for delegated transfer")
    })
 })
    it("handles delegated token transfers",function(){
        return MyToken.deployed().then(function(instance){
            tokenInstance=instance;
            fromAccount=accounts[2];
            toAccount=accounts[3];
            spendingAccount=accounts[4];  //msg.sender()
           // transfer some accounts tp fromAccount
           return tokenInstance.transfer(fromAccount,100,{from:accounts[0]});
        }).then(function(receipt){
            //Approve spendingAccount to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount,10,{from:fromAccount})
        }).then(function(receipt){
            return tokenInstance.transferFrom(fromAccount,toAccount,1000,{from:spendingAccount})
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert")>=0,"cannot transfer larger value than balance");
            //try transferring something larger than the approved amount
            return tokenInstance.transferFrom(fromAccount,toAccount,20,{from:spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf("revert")>=0,"cannot transfer larger than approved amount");
            return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from:spendingAccount});
       }).then(function(success){
           assert.equal(success,true,"transfer done");
           return tokenInstance.transferFrom(fromAccount,toAccount,10,{from:spendingAccount});
       }).then(function(receipt){
        assert.equal(receipt.logs.length,1,"triggers one event");
        assert.equal(receipt.logs[0].event,"Transfer","should be the Approval event")
        assert.equal(receipt.logs[0].args._from,fromAccount,"Logs the account,tne tokens are authorized from");
        assert.equal(receipt.logs[0].args._to,toAccount,"Logs the account,the tokens are authorized to");
        assert.equal(receipt.logs[0].args._value,10,"Logs the transfer amount");
       return tokenInstance.balanceOf(fromAccount);
      }).then(function(balance){
          assert.equal(balance.toNumber(),90,"deducts the amount from the sending account");
           return tokenInstance.balanceOf(toAccount);
       }).then(function(balance){
           assert.equal(balance.toNumber(),10,"adds the amount  to receiving account");
           return tokenInstance.allowance(fromAccount,spendingAccount);
       }).then(function(balance){
           assert.equal(balance.toNumber(),0,"deducts the amount from allowance");
       })
    })

})