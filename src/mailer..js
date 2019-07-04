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
        to: user.email,
        text:`
        welcome to bookstore. Plese confirm your email address.
        
        ${user.generateConfirmationUrl()}`
    }
    transport.sendMail(email);
}