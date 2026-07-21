const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'iqromaxuz@gmail.com', pass: 'jybx btwa afng irxl' }
});
transporter.sendMail({
  from: '"IQROMAX Admin" <iqromaxuz@gmail.com>',
  to: 'iqromaxuz@gmail.com', // send to itself
  subject: 'Test Send',
  text: 'This is a test.'
}).then(info => console.log('Sent:', info.messageId))
  .catch(err => console.error('Error:', err));
