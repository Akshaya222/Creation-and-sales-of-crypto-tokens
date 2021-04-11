const router = require('express').Router();   
const User = require('../models/user')
const passport = require('passport');
const utils = require('../lib/utils');
const crypto=require('crypto');
const mail=require('../nodemailer');
const fs = require('fs');
const {nanoid}=require('nanoid');

router.get('/protected',passport.authenticate('jwt',{session:false}), (req, res, next) => {
    res.status(200).json({success:true,msg:'You are authorized'})
});


router.post('/login', function(req, res, next){
    User.findOne({ username: req.body.username })
    .then((user) => {
        if (!user) {
            return res.status(401).send({ success: false, message: "could not find user"});
        }
        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).send({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires,user:user });

        } else {

          return  res.status(401).send({ success: false, message: "you entered the wrong password" });

        }
    })
    .catch((err) => {
        next(err);
    });
});

router.post('/register', function(req, res, next){
    User.findOne({username:req.body.username}).then((user)=>{
        if(user){
           return res.status(400).send({
                message:"Username already exists!"
            });
        }
    }).catch((err)=>{
        return res.status(400).send({message:err})
    })
    const saltHash = utils.genPassword(req.body.password);    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const otp=nanoid(6);

    const newUser = new User({
        username: req.body.username,
        name:req.body.name,
        hash: hash,
        salt: salt,
        isAdmin:req.body.isAdmin,
        verifyOtp:otp,
        otpExpiry:Date.now()+600000
    });

    try {
      newUser.save()
            .then((user) => {
                mail.sendMail(user.username,"verify email",`Your otp is ${otp}.It will expire in 10 minutes`)
                const jwt=utils.issueJWT(user)
                res.status(200).send({ success: true, user: user,token:jwt.token,expiresIn:jwt.expires });
            });

    } catch (err) {
        
    return  res.status(400).send({ success: false, message: err });
    
    }
});

router.post("/forget-password",(req,res)=>{
    console.log("req",req.body.email);
    console.log("forgot password")
    User.findOne({username:req.body.email}).then((user)=>{
       if(!user){
       return res.status(404).send({
            status:"failure",
            message:"User doesn't exists"
        })
       }
       else{
      var token = crypto.randomBytes(32).toString('hex');
      console.log(Date.now())
      var expires=Date.now()+600000
      var message=`<h4>click this link to reset password</h4>
      <a href="http://localhost:3000/reset-password.html">${token}</a>`
      User.findOneAndUpdate({username:req.body.email},{resetToken:token,expiresIn:expires},{new:true},
        function(err,docs){
            if(err){
              return  res.status(500).send({
                    message:"some internal error occured try again",
                    error:err
                })
            }
            else{
                mail.sendMail(req.body.email,"Reset password",message);
                res.status(200).send({
                    message:"reset link has been sent to your registered email",
                    user:docs
                })
            }
        })
       }
    })
})

router.post("/reset-password",(req,res)=>{
    const sentToken=req.body.token
    console.log(sentToken)
    User.findOne({resetToken:sentToken,expiresIn:{$gt:Date.now()}}).then((user)=>{
        const saltHash = utils.genPassword(req.body.password);  
        const salt = saltHash.salt;
        const hash = saltHash.hash;
        user.resetToken=undefined,
        user.expiresIn=undefined,
        user.salt=salt,
        user.hash=hash
        user.save().then((data)=>{
            mail.sendMail(user.username,"Password reset successfull","Password has been changed successfull");
            res.status(200).send({
                message:"password changed successfully",
                user:data
            })
        })

    })
    .catch((error)=>{
      return  res.status(404).send({
            message:"token expired, try again"})
    })
})

router.get("/logout/:userId",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const user=await User.findById(req.params.userId);
    if(!user){
       return res.status(401).send({
            message:"User not found"
        })
    }
    req.logout();
   return res.status(200).send({
        message:"Successfully logged out"
    })
})

router.get("/sendOtp/:userId",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const user=await User.findById(req.params.userId);
    if(!user){
        return res.status(401).send({
            message:"User not found"
        })
    }
    var token = crypto.randomBytes(32).toString('hex');
    mail.sendMail(user.username,"Otp",token);
    res.status(200).send({
        message:"otp has been sent",
        data:token
    })
})

router.post("/sendOtp/verifyEmail/:userId",passport.authenticate('jwt',{session:false}),async(req,res)=>{
    console.log(req.body.otp);
    const user=await User.findById(req.params.userId);
    if(!user){
        return res.status(401).send({
            message:"User not found"
        })
    }
    else{
        User.findOne({username:user.username,verifyOtp:req.body.otp}).then((user)=>{
             if(user){
                 User.findOne({username:user.username,otpExpiry:{$gt:Date.now()}}).then((user)=>{
                     user.verified=true,
                     user.verifyOtp=undefined,
                     user.otpExpiry=undefined
                     user.save().then((user)=>{
                         res.status(200).send({
                             message:"Email verified successfully",
                             user:user
                         })
                     })
                 }).catch((error)=>{
                     return res.status(404).send({
                         message:"otp expired try again"
                     })
                 })
             }
        }).catch((error)=>{
            return res.status(404).send({
                message:"You entered wrong otp"
            })
        })
    }
})

router.post("/sendEmails",passport.authenticate('jwt',{session:false}),(req,res)=>{
    User.find({}).then((users)=>{
        users.forEach((user)=>{
            console.log(user.username)
            mail.sendMail(user.username,req.body.subject,req.body.message);
        })
        res.status(200).send({
            message:"Emails has been sent successfully!"
        })
    }).catch((error)=>{
        res.status(400).send({
            message:"Some error in sending mails"
        })
    })
})

module.exports = router;