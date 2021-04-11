App={
    web3Provider:null,
    contracts:{},
    loading:false,
    tokenPrice:0,
    tokensSold:0,
    account:0,
    totalTokens:0,
    mytokenInstance:null,
    mytokenSaleInstance:null,
    init:function(){
        console.log("app initialized");
        return App.initWeb3();
    },
    initWeb3:function(){
            // Modern dapp browsers...
   if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      console.log("success")
      window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
   App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(App.web3Provider);
  return App.initContracts();
    },

    initContracts: async function(){
      await  $.getJSON("MyTokenSale.json",function(myTokenSale){
            App.contracts.MyTokenSale=TruffleContract(myTokenSale);
            App.contracts.MyTokenSale.setProvider(App.web3Provider);
            App.contracts.MyTokenSale.deployed().then(function(myTokenSale){
                console.log("mytokensale",myTokenSale.address);
            });
        }).done( function(){
           $.getJSON("MyToken.json",function(myToken){
                App.contracts.MyToken=TruffleContract(myToken);
                App.contracts.MyToken.setProvider(App.web3Provider);
                App.contracts.MyToken.deployed().then(function(myToken){
                    App.mytokenInstance=myToken;
                    console.log("mytoken",myToken.address);
                    //App.listenForEvents();
                    App.render();
                });
            })
        })
    },
    render:function(){
        if(App.loading){
            return;
        }
        App.loading=true;
        var loader=$("#loader");
        var content=$("#content");
        loader.show();
        content.hide();

        //load account data
        web3.eth.getCoinbase(function(err,account){
            if(err===null){
                console.log("account",account)
                App.account=account
                $("#accountAddress").html(account)
                $("#adminAddress").html(account);
                let balance = null;
               // $("#balance").html(balance);
                web3.eth.getBalance(account, (err, bal) => {
                    if (err) {
                      console.log(`getBalance error: ${err}`);
                    } else {
                      balance = bal;
                      $("#balance").html(balance);
                      console.log(`Balance [${account}]: ${web3.utils.fromWei(balance, "ether")}`);
                    }
                  });
            }
        })
       App.totalTokens=parseInt(localStorage.getItem("totalTokens"))
        App.contracts.MyTokenSale.deployed().then(function(myTokenSale){
            mytokenSaleInstance=myTokenSale
            return mytokenSaleInstance.tokenPrice();
           }).then(function(price){
               App.tokenPrice=price.toNumber();
               $(".token-price").html(web3.utils.fromWei(price,"ether"));
               return mytokenSaleInstance.tokensSold();
           }).then(function(tokensSold){
               console.log("tokensSOld",tokensSold);
               App.tokensSold=tokensSold.toNumber();
               $("#tokens-sold").html(App.tokensSold);
               $("#tokensSold").html(App.tokensSold);
               $("#total-tokens").html(App.totalTokens);
               $("#tokensLeft").html(App.totalTokens-App.tokensSold)
               percent=Math.ceil((App.tokensSold/App.totalTokens)*100)
               $(".progress-bar").css("width",`${percent}%`)
           })
           
           App.contracts.MyToken.deployed().then(function(instance){
               MyTokenInstance=instance;
               return MyTokenInstance.balanceOf(App.account);
           }).then(function(balance){
               $(".dapp-balance").html(balance.toNumber());
               $("#tokensOwned").html(balance.toNumber());
               return MyTokenInstance.name();
           }).then(function(name){
               $("#tokenName").html(name);
               return MyTokenInstance.symbol();
           }).then(function(symbol){
               $("#tokenSymbol").html(symbol);
               return MyTokenInstance.balanceOf(App.account);
           }).then(function(adminBalance){
               $("#adminBalance").html(adminBalance.toNumber());
           })

           App.loading=false;
           loader.hide();
           content.show();

    },

    buyTokens:async function(){
        App.loading=true;
        var loader=$("#loader");
        var content=$("#content");

        loader.show();
        content.hide();
        var numberOfTokens=$("#numberOfToken").val();
        App.contracts.MyTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens,{from:App.account,
            value:numberOfTokens * App.tokenPrice,gas:500000})
        }).then(async function(result){
            $('form').trigger('reset') //reset number of tokens in form
            let user=JSON.parse(localStorage.getItem("userObject"));
            let token=JSON.parse(localStorage.getItem("token"))
            await fetch(`http://localhost:3008/routes/transactions/create/transaction/${user._id}`, {
                method: 'POST',
                body: JSON.stringify({
                   number:numberOfTokens,
                   fromAccount:result.receipt.from,
                   toAccount:result.receipt.to,
                   gas:result.receipt.gasUsed,
                   blockHash:result.receipt.blockHash,
                   transactionHash:result.receipt.transactionHash
            }),
                headers: {
                 'Content-Type': 'application/json',
                 'Authorization':token
               }
             }).then(async(data)=>{
                 console.log(data);
                 const myJson = await data.json(); //extract JSON from the http response
                 console.log(myJson)    //myJson.msg
                 if(myJson.user){
                    localStorage.setItem("userObject",JSON.stringify(myJson.user))
                   }
                   alert(myJson.message)
                 location.reload();
            })
            .catch((err)=>{
              alert(err)
            })  
        })

        App.loading=false;
        loader.hide();
        content.show();
    },

    transferTokens:function(){
        var numberOftokens=$("#noOfTokens").val();
        let transferAddress=null;
        App.contracts.MyTokenSale.deployed().then(function(instance){
           transferAddress=instance.address;
           App.contracts.MyToken.deployed().then(function(instance){
            return instance.transfer(transferAddress,numberOftokens,{from:App.account}).then(function(result){
                console.log("result in traansfer",result)
                if(parseInt(localStorage.getItem("totalTokens"))){
                    App.totalTokens=parseInt(localStorage.getItem("totalTokens"))+parseInt(numberOftokens);
                }
                else{
                    App.totalTokens=parseInt(numberOftokens);
                }
                localStorage.setItem("totalTokens",App.totalTokens);
                $("#total-tokens").html(App.totalTokens);
                console.log(result.receipt)
                console.log("tokens bought....");
                location.reload();
                $('#transferform').trigger('reset') //reset number of tokens in form
            })
        })
        })
    },
    endSale:function(){
        App.contracts.MyTokenSale.deployed().then(function(instance){
           return instance.endSale({from:App.account}).then(function(result){  
               location.reload();
           })
        })
    }
}

$(document).ready(function(){
    App.init()
})
  

