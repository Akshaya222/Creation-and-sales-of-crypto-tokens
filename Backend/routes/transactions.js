var router=require('express').Router();
var User=require('../models/user');
const passport = require('passport');
const mail=require('../nodemailer');

router.get("/getTransactions",(req,res)=>{
    User.find({}).then((users)=>{
        res.send(users)
    }).catch((error)=>{
        res.send(error)
    })
})

router.post("/create/transaction/:userId",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    var user=await User.findById(req.params.userId)
    if(!user){
        return res.status(401).send({
            message:"User not found"
        })
    }
    console.log(req.body)
    mail.sendMail(user.username,"Transaction Successfull","Your transaction has been successfull!");
    var newTransaction={
        noOfTokens:req.body.number,
        fromAccount:req.body.fromAccount,
        toAccount:req.body.toAccount,
        gas:req.body.gas,
        blockHash:req.body.blockHash,
        transactionHash:req.body.transactionHash
    }
  transactions=user.Transactions;
  transactions.push(newTransaction);
  user.Transactions=transactions
  user.save().then((user)=>{
      res.status(200).send({
          message:"details updated successfully",
          user:user
      })
    }).catch((err)=>{
        return  res.status(400).send({
              message:"Some internal changes occured,please try again",
              error:err
          })
  })
})


module.exports=router;