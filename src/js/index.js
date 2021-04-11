var days=document.getElementById("days");
var hours=document.getElementById("hours")
var minutes=document.getElementById("minutes");
var seconds=document.getElementById("seconds");

const EndDate= "17 April 2021"

const counterTime=()=>{
const newEndDate=new Date(EndDate)
const currentDate=new Date()
const diff=(newEndDate-currentDate) / 1000;
const daysRemaining=Math.floor(diff/3600/24);
const hoursRemaining=Math.floor(diff/3600)%24;
const minsRemaining=Math.floor(diff/60)%60;
const secondsRemaining=Math.floor(diff) % 60
days.innerHTML=daysRemaining<10?"0"+daysRemaining:daysRemaining
hours.innerHTML=hoursRemaining<10?"0"+hoursRemaining:hoursRemaining
minutes.innerHTML=minsRemaining<10?"0"+minsRemaining:minsRemaining
seconds.innerHTML=secondsRemaining<10?"0"+secondsRemaining:secondsRemaining
}
counterTime()

setInterval(counterTime,1000)

const showDashboard=()=>{
    let user=JSON.parse(localStorage.getItem("userObject"));
    if(user.isAdmin){
        window.location.replace("http://localhost:3000/admin.html")
    }
    else{
        window.location.replace("http://localhost:3000/dash.html")
    }
}