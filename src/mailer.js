import nodemailer from 'nodemailer';

const from = `"Bookstore" <info@bookstore.com>`;

export function setup(){
    return nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });
}

export function sendConfirmationEmail(user){
    const transport = setup();
    const email ={
        from,
        Subject:"Email Confirmation",
        to: user.email,
        text:`
        welcome to bookstore. Plese confirm your email address.
        
        ${user.generateConfirmationUrl()}`
    }
    transport.sendMail(email);
}
export function sendResetPasswordEmail(user){
    const transport = setup();
    const email ={
        from,
        to: user.email,
        Subject:"Reset Password",
        text:`
        Please use the below link to reset your password.
        
        ${user.generateResetPasswordUrl()}`
    }
    transport.sendMail(email);
}
