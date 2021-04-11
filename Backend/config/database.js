const mongoose=require('mongoose');


module.exports=mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useFindAndModify:false,useUnifiedTopology:true}).then(()=>{
    console.log("done")
 }).catch((error)=>{
     console.log(error);
 });
 