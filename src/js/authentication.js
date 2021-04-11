var loginEmail=document.getElementById("loginEmail");
var loginPassword=document.getElementById("loginPassword");
var registerName=document.getElementById("registerName");
var registerEmail=document.getElementById("registerEmail");
var registerPassword=document.getElementById("registerPassword");
var forgotEmail=document.getElementById("forgotEmail");
var resetPassword=document.getElementById("resetPassword");
var resetConPass=document.getElementById("resetConPass");

const registerHandler = async(e)=>{
    e.preventDefault();
     await fetch('http://localhost:3008/routes/users/register', {
        method: 'POST',
        body: JSON.stringify({
        name: registerName.value,
        username:registerEmail.value,
        password: registerPassword.value 
    }),
        headers: {
         'Content-Type': 'application/json'
       }
     }).then(async(data)=>{
         console.log(data);
         const myJson = await data.json(); //extract JSON from the http response
         if(myJson.user){
          localStorage.setItem("userObject",JSON.stringify(myJson.user))
          localStorage.setItem("token",JSON.stringify(myJson.token))
          window.location.replace("http://localhost:3000/otp.html")
         }
         console.log(myJson) 
         registerEmail.innerHTML=""
         registerName.innerHTML=""
         registerPassword.innerHTML=""
    })
    .catch((err)=>{
      console.log("errror")
      alert(err);
    })
}

const loginHandler=async(e)=>{
    e.preventDefault()
    await fetch('http://localhost:3008/routes/users/login', {
        method: 'POST',
        body: JSON.stringify({
        username: loginEmail.value,
        password:loginPassword.value 
    }),
        headers: {
         'Content-Type': 'application/json'
       }
     }).then(async(data)=>{
         console.log(data);
         const myJson = await data.json(); //extract JSON from the http response
         if(myJson.user){
          localStorage.setItem("userObject",JSON.stringify(myJson.user))
          localStorage.setItem("token",JSON.stringify(myJson.token))
          window.location.replace("http://localhost:3000/sale.html")
         }
         loginEmail.innerHTML=""
         loginPassword.innerHTML=""
    })
    .catch((err)=>{
      alert(err);
    })
}

const forgotHandler=async(e)=>{
    e.preventDefault();
    let token=JSON.parse(localStorage.getItem("token"))
    await fetch('http://localhost:3008/routes/users/forget-password', {
        method: 'POST',
        body: JSON.stringify({
        email: forgotEmail.value 
    }),
        headers: {
         'Content-Type': 'application/json',
         'Authorization':token
       }
     }).then(async(data)=>{
         console.log(data);
         const myJson = await data.json(); //extract JSON from the http response
         if(myJson.user){
          localStorage.setItem("userObject",JSON.stringify(myJson.user))
         }
         alert(myJson.message)
    })
    .catch((err)=>{
      alert(err)
    })
}

const resetHandler=async(e)=>{
  e.preventDefault();
  let token=JSON.parse(localStorage.getItem("token"))
  if(resetPassword.value!=resetConPass.value){
    alert("passwords mismatch");
    return;
  }
  var resettoken=JSON.parse(localStorage.getItem("userObject")).resetToken
  await fetch('http://localhost:3008/routes/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({
    password: resetPassword.value,
    token:resettoken
}),
    headers: {
     'Content-Type': 'application/json',
     'Authorization':token
   }
 }).then(async(data)=>{
     console.log(data);
     const myJson = await data.json(); //extract JSON from the http response
     if(myJson.user){
      localStorage.setItem("userObject",JSON.stringify(myJson.user))
      window.location.replace("http://localhost:3000/")
     }
     alert(myJson.message)
})
.catch((err)=>{
  alert(err)
})     
}

const logoutHandler=async(e)=>{
  e.preventDefault();
  let token=JSON.parse(localStorage.getItem("token"))
 let user= JSON.parse(localStorage.getItem("userObject"))
  await fetch(`http://localhost:3008/routes/users/logout/${user._id}`, {
    method: 'GET',
    headers: {
     'Content-Type': 'application/json',
     'Authorization':token
   }
 }).then(async(data)=>{
     console.log(data);
      const myJson = await data.json(); //extract JSON from the http response
      localStorage.removeItem("userObject");
      localStorage.removeItem("token")
      localStorage.removeItem("totalTokens")
      window.location.replace("http://localhost:3000/")
     alert(myJson.message)
})
.catch((err)=>{
  alert(err)
})     
}