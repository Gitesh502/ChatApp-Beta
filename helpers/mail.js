var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'raju.technoxis@gmail.com',
        pass: 'technoxis@123'
    }
});
module.exports=transporter;