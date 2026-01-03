import { SQSHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const ses = new AWS.SES({ region: 'us-east-1' });

interface EmailMessage {
  to: string;
  guest: string;
  plusOne?: string;
}

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    console.log(`Processing record ${record.body}`);
    const message: EmailMessage = JSON.parse(record.body);
    console.log(`Sending email to ${message.to}`);

    try {
      const html = renderEmailTemplate(message.guest, message.plusOne);
      await ses.sendEmail({
        Source: 'wedding-invite@jolly-and-bainian.click',
        Destination: {
          ToAddresses: [message.to],
        },
        Message: {
          Subject: { Data: "Thanks for your RSVP to Jolly & Bainian's Wedding🦋" },
          Body: {
            Html: { Data: html },
          },
        },
      }).promise();

      console.log(`Email sent to ${message.to}`);
    } catch (err) {
      console.error('Error sending email', err);
    }
  }
};

function renderEmailTemplate(guest: string, plusOne?: string) {
  let html = fs.readFileSync(path.join(__dirname, 'email.html'), 'utf8');

  html = html.replace(/{{guest}}/g, guest);
  if (plusOne) {
    html = html.replace(/{{plusOne}}/g, ` and ${plusOne}`);
  } else {
    html = html.replace(/{{plusOne}}/g, '');
  }

  return html;
}
