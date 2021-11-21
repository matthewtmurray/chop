import emailer from '@sendgrid/mail';

export const sendEmail = async (to, resetToken, userId )=>{
    emailer.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: to, // Change to your recipient
        from: 'matthewtmurray@gmail.com', // Change to your verified sender
        subject: 'Password reset',
        text: 'If you requested a password reset please click the' + 
                    'link below and follow the instructions to reset your password. If not please ignore this email' ,
        html: `<a href="http://electric.westeurope.cloudapp.azure.com:3000/passwordreset?userid=${userId}&resetToken=${resetToken}">Click here to reset your password</a>`,
      }
      emailer
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
};