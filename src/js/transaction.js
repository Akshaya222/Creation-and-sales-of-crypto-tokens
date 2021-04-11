let userObject= JSON.parse(localStorage.getItem("userObject"))
let tableItems=userObject.Transactions;
let tableBody=document.getElementById("tableBody");
console.log("table items",tableItems)
let str = "";
let gas=0;
let tokens=0;
tableItems.forEach((element,index) => {
    console.log(element)
    gas+=parseInt(element.gas);
    tokens+=parseInt(element.noOfTokens);
    str += `
    <tr>
    <th scope="row">${index + 1}</th>
    <td>${element.noOfTokens}</td>
    <td>${element.gas}</td> 
    <td>${element.fromAccount}</td> 
    <td>${element.toAccount}</td> 
    <td>${element.transactionHash}</td> 
    <td>${element.blockHash}</td> 
    </tr>`;
});
tableBody.innerHTML=str;
document.getElementById("gasUsed").innerHTML=gas;
document.getElementById("totalTokensAvaible").innerHTML=tokens
