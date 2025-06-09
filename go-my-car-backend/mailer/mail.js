
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.MAILHOSTNAME,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});


const replySendMail = async (email, reply) => {

    console.log('1email', email)
    console.log('1reply', reply)
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Go-My-Car`,
           html: `
        <div style="margin-top: 50px; font-family: Arial, sans-serif; color: #333;">
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Thank you for reaching out to us.</p>
          <p style="font-size: 16px;">Here is our reply to your query:</p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #007BFF; margin: 20px 0;">
            <p style="font-size: 15px; margin: 0;">${reply}</p>
          </div>
          <p style="font-size: 16px;">Please let us know if you have any further questions.</p>
         <p>Best regards,<br/><strong>Go-My-Car Team</strong></p>
        </div>
      `,
        }


        await transporter.sendMail(mailOptions);
         console.log("Mail sent successfully");
    } catch (error) {
        console.error("Mail sending error:", error);

    }
}
const SendBooking = async (email,fullName, start, end, location) => {


    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Go-My-Car Booking Confirm`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a73e8;">🚗 Your Booking is Confirmed!</h2>
          <p>Hi,</p>
          <p>Thank you for choosing <strong>Go-My-Car</strong>. Here are your booking details:</p>
          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
               <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
             <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
            </tr>
          <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Pickup Location:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${location}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Start Time:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${start}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>End Time:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${end}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">We look forward to serving you. 🚙</p>
          <p>Best regards,<br/><strong>Go-My-Car Team</strong></p>
        </div>
      `,
        }


        await transporter.sendMail(mailOptions);
       console.log("Mail sent successfully");
    } catch (error) {
        console.error("Mail sending error:", error);

    }
}
module.exports = { replySendMail, SendBooking };