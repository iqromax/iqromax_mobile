const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'iqromaxuz@gmail.com',
    pass: 'jybx btwa afng irxl' // Try with spaces first
  }
});

const mailOptions = {
  from: 'iqromaxuz@gmail.com',
  to: 'test@example.com', // Replace with a valid test email if needed, or just see if auth works
  subject: 'Test Email',
  text: 'Testing 123'
};

console.log('Verifying connection...');
transporter.verify(function(error, success) {
  if (error) {
    console.log('Auth Error (with spaces):', error);
    
    // Try without spaces
    const transporter2 = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'iqromaxuz@gmail.com',
        pass: 'jybxbtwaafngirxl' 
      }
    });
    
    transporter2.verify(function(error2, success2) {
      if (error2) {
        console.log('Auth Error (without spaces):', error2);
      } else {
        console.log('Server is ready to take our messages (without spaces)');
      }
    });
    
  } else {
    console.log('Server is ready to take our messages (with spaces)');
  }
});
