import { SQSHandler } from 'aws-lambda';
import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' });

interface EmailMessage {
  to: string;
  subject: string;
  htmlBody: string;
}

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    console.log(`Processing record ${record.body}`);
    const message: EmailMessage = JSON.parse(record.body);
    console.log(`Sending email to ${message.to}`);

    try {
      await ses.sendEmail({
        Source: 'donot-reply@jolly-and-bainian.click',
        Destination: {
          ToAddresses: [message.to],
        },
        Message: {
          Subject: { Data: message.subject },
          Body: {
            Html: { Data: message.htmlBody },
          },
        },
      }).promise();

      console.log(`Email sent to ${message.to}`);
    } catch (err) {
      console.error('Error sending email', err);
    }
  }
};
