const nodemailer = require('nodemailer')

class Helper{
    static resHandler (res , status , apiStatus , data, message){
        res.status(status).send({
            apiStatus,
            data,
            message
        })
    } 

    static sendMail (email , id , message , subject){
    const transporter = nodemailer.createTransport({
        service: process.env.EMAILSERVIVE,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAILPASS
        }
      });
    
      var mailOptions = {
        from: 'fifa.m0stafa.mazhar@gmail.com',
        to: email,
        subject: subject,
        text: message + id
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
}



module.exports = Helper