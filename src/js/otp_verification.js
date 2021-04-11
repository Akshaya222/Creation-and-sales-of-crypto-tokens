let user= JSON.parse(localStorage.getItem("userObject"))
console.log("user",user)
userId = user._id;
var otp = document.getElementById("otp");

const otpHandler = async(e) =>{
    e.preventDefault();
    let token=JSON.parse(localStorage.getItem("token"))
    await fetch(`http://localhost:3008/routes/users/sendOtp/verifyEmail/${user._id}`, {
        method: 'POST',
        body: JSON.stringify({
            otp: otp.value
        }),
        headers:{
            'Content-Type': 'application/json',
            'Authorization':token
        }
    }).then(async(data)=>{
        console.log(data);
        console.log(data);
         const myJson = await data.json(); //extract JSON from the http response
        if(myJson.user){
            localStorage.setItem("userObject",JSON.stringify(myJson.user))
            window.location.replace("http://localhost:3000/sale.html")
        }
        alert(myJson.message)
         console.log(myJson)    //myJson.msg
        
    }).catch((err)=>{
        console.log("error");
        console.log(err);
    })
}
const resendOtpHandler = async(e) =>{
    e.preventDefault();
    let token=JSON.parse(localStorage.getItem("token"))
    await fetch(`http://localhost:3008/routes/users/sendOtp/${user._id}`
    ).then(async(data)=>{
        console.log(data);
        console.log(data);
         const myJson = await data.json(); //extract JSON from the http response
         localStorage.setItem("userObject",JSON.stringify(myJson))
         console.log(myJson)    //myJson.msg
        
    }).catch((err)=>{
        console.log("error");
        console.log(err);
    })
}