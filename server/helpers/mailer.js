const mailer = require('nodemailer')

export const transporter = mailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

export const checkOutMail = (data) => {
    return{
        from: process.env.EMAIL,
        to: ``,
        subject: "Checkout Lubindo",
        text: `this is your verification code ${dataUser.code}`
    }
}




