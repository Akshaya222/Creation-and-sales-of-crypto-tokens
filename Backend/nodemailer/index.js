const nodemailer=require('nodemailer');

async function sendMail(to,subject,message){
    var transporter = nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: 'akshayareddy22111@gmail.com',
          pass: 'A21n02u00.'
        }
      });
      
      var mailOptions = {
        from: 'akshayareddy22111@gmail.com',
        //to: 'banalaaishwarya2002@gmail.com',
        to:to,
      //  subject: 'Sending Email using Node.js',
      subject:subject,
       // text: 'That was easy!',
       //text:message
        html: message
      };
      
    await  transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return "false"
        } else {
          console.log('Email sent: ' + info.response);
         return "hello"
        }
      });
}
module.exports.sendMail=sendMail

