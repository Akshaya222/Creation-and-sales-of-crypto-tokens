App={
    web3Provider:null,
    contracts:{},
    loading:false,
    tokenPrice:0,
    tokensSold:0,
    account:0,
    totalTokens:750000,
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
                App.mytokenSaleInstance=myTokenSale;
                console.log("**************",App.mytokenSaleInstance)
            });
        }).done( function(){
           $.getJSON("MyToken.json",function(myToken){
                App.contracts.MyToken=TruffleContract(myToken);
                App.contracts.MyToken.setProvider(App.web3Provider);
                App.contracts.MyToken.deployed().then(function(myToken){
                    App.mytokenInstance=myToken;
                    console.log("mytoken",myToken.address);
                    console.log("&&&&&&&&&&&&&&&&&",App.mytokenInstance)
                    App.listenForEvents();
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
                console.log("account *******",account)
                App.account=account
                console.log("1111111111111111",account)
                $("#accountAddress").html(account)
            }
        })


        App.contracts.MyTokenSale.deployed().then(function(myTokenSale){
           MyTokenSaleInstance=myTokenSale; 
           console.log("#################################################")
           return MyTokenSaleInstance.tokenPrice();
           }).then(function(price){
               App.tokenPrice=price.toNumber();
               console.log("2222222222222222222toke",price.toNumber())
               $(".token-price").html(web3.utils.fromWei(price,"ether"));
               return MyTokenSaleInstance.tokensSold();
           }).then(function(tokensSold){
               console.log("tokensSOld",tokensSold);
               App.tokensSold=tokensSold.toNumber();
               console.log("3333333",App.tokensSold,App.totalTokens)
               $("#tokens-sold").html(App.tokensSold);
               $("#total-tokens").html(App.totalTokens);
               percent=Math.ceil((App.tokensSold/App.totalTokens)*100)
               $(".progress-bar").css("width",`${percent}%`)
           })
           
           App.contracts.MyToken.deployed().then(function(instance){
               MyTokenInstance=instance;
               console.log("55555555555555555")
               return MyTokenInstance.balanceOf(App.account);
           }).then(function(balance){
               console.log("444444444444444444444",balance)
               $(".dapp-balance").html(balance.toNumber());
           })

           App.loading=false;
           loader.hide();
           content.show();

    },

    buyTokens:function(){
        App.loading=true;
        var loader=$("#loader");
        var content=$("#content");

        loader.show();
        content.hide();

        var numberOfTokens=$("#numberOfToken").val();
        App.contracts.MyTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens,{from:App.account,
            value:numberOfTokens * App.tokenPrice,gas:500000},)
        }).then(function(result){
            console.log("tokens bought....");
            $('form').trigger('reset') //reset number of tokens in form
            //wait for Sell event
        })

        App.loading=false;
        loader.hide();
        content.show();
    },

    listenForEvents:function(){
        App.contracts.MyTokenSale.deployed().then(function(instance){
            //export async function callEvent () {
                // await Contract.events.PracticeEvent().watch((response) => {
                //   console.log('the event has been called', response);
                // }).catch((err) => {
                //   console.log(err);
                // })
              const listener = instance.Sell(
                {
                  fromBlock:0,
                  toBlock:'latest'
                }
                ,
               
                    function(error,event){
                        console.log("eventssssssssssssssssss",event)
                    }
               
              )
              console.log("$$$$$$$$$$$$$$$$$",listener)
            //   console.log("instance*******88",instance.events)
            //   instance.Sell({  fromBlock:0,
            //       toBlock:'latest'},{function(error,event){
            //           console.log("#############",event);
            //       } })
              // }).watch(function(error,event){
              //     if(!error){
              //         console.log("event triggered",event);
              //         App.render();
              //     }
              // })
        })
    }
}

$(document).ready(function(){
    App.init()
})
  

