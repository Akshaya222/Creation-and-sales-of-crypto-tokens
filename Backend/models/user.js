const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    name:String,
    username:String,
    hash:String,
    salt:String,
    verified:{
        type:Boolean,
        default:false
    },
    resetToken:String,
    expiresIn:Date,
    verifyOtp:String,
    otpExpiry:Date,
    isAdmin:{
        type:Boolean,
        default:false
    },
    Transactions:[
        {
            noOfTokens:Number,
            fromAccount:String,
            toAccount:String,
            gas:String,
            blockHash:String,
            transactionHash:String
        }
    ]
})

var User=mongoose.model('User',userSchema);
module.exports=User;