const MyToken = artifacts.require("MyToken");
const MyTokenSale=artifacts.require("MyTokenSale");

module.exports = function (deployer) {
  deployer.deploy(MyToken,1000000).then(function(){
    //token price is 0.001 ether
    const tokenPrice= 1000000000000000 //in wei
    return deployer.deploy(MyTokenSale,MyToken.address,tokenPrice);
  })

};
