import { SQSHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import SSM from 'aws-sdk/clients/ssm';
import fs from 'fs';
import path from 'path';
import nodemailer from "nodemailer";

const ses = new AWS.SES({ region: 'us-east-1' });

interface EmailMessage {
  to: string;
  guests: string[];
}

export const handler: SQSHandler = async (event) => {
  const ssm = new SSM();
  const emailAddress = (await ssm.getParameter({ Name: 'email_address' }).promise()).Parameter?.Value;
  const emailPassword = (await ssm.getParameter({ Name: 'email_password' }).promise()).Parameter?.Value;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: emailAddress,
      pass: emailPassword,
    },
  });

  for (const record of event.Records) {
    console.log(`Processing record ${record.body}`);
    const message: EmailMessage = JSON.parse(record.body);
    console.log(`Sending email to ${message.to} for guests ${JSON.stringify(message.guests)}`);

    try {
      const html = renderEmailTemplate(message.guests);
      await transporter.sendMail({
        from: `"Jolly & Bainian" <wedding-invites@jolly-and-bainian.click>`,
        to: message.to,
        subject: "Thanks for your RSVP to Jolly & Bainian's Wedding🦋",
        html,
      });
      console.log(`Email sent to ${message.to}`);
    } catch (err) {
      console.error('Error sending email', err);
    }
  }
};

function renderEmailTemplate(guests: string[]) {
  let html = fs.readFileSync(path.join(__dirname, 'email.html'), 'utf8');
  let guestList = "";
  for (let i = 0; i < guests.length; i++) {
    if (i === guests.length - 1 && i > 0) {
      guestList += ` and ${guests[i]}`;
    } else {
      guestList += `${guests[i]}`;
    }

    if (i < guests.length - 2) {
      guestList += ", ";
    }
  }

  html = html.replace(/{{guests}}/g, guestList);
  return html;
}
