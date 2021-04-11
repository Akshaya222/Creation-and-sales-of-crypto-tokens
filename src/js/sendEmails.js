var subject = document.getElementById("subject");
var message = document.getElementById("message");

const emailHandler = async(e) =>{
  e.preventDefault();
  let token=JSON.parse(localStorage.getItem("token"))
  await fetch(`http://localhost:3008/routes/users/sendEmails`, {
      method: 'POST',
      body: JSON.stringify({
          subject: subject.value,
          message: message.value
      }),
      headers:{
          'Content-Type': 'application/json',
          'Authorization':token
      }
  }).then(async(data)=>{
       const myJson = await data.json(); //extract JSON from the http response
      alert(myJson.message);
      subject.innerHTML="";
      message.innerHTML="";
      
  }).catch((err)=>{
    //  console.log("error");
      alert(err);
  })
}