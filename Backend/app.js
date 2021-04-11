const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config();
require('./config/database')
const passport=require('passport')
const mail=require('./nodemailer/index');

app.use(express.json())
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
//app.use(express.urlencoded({ extended: false }));
// combines the 2 above, then you can parse incoming Request Object if object, with nested objects, or generally any type.
app.use(express.urlencoded({ extended: true }));
app.use(cors())


// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());
//mail("how are you?","18bcs017@iiitdwd.ac.in")


app.use('/routes',require('./routes/index'));

app.listen(3008,()=>{
    console.log(`server is running on port ${3008}`)
})