import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { CloudWatchLogsDecodedData, CloudWatchLogsEvent, Context, Handler } from 'aws-lambda';
import zlib from 'zlib';

const snsClient = new SNSClient({ region: process.env.REGION });

export const handler: Handler = async (event: CloudWatchLogsEvent, context: Context) => {
  // https://docs.aws.amazon.com/zh_cn/lambda/latest/dg/services-cloudwatchlogs.html
  const payload = Buffer.from(event.awslogs.data, 'base64');
  const data = JSON.parse(zlib.gunzipSync(payload).toString()) as CloudWatchLogsDecodedData;

  const cloudWatchUrl = `https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/${encodeURIComponent(
    encodeURIComponent(data.logGroup)
  )}/log-events/${encodeURIComponent(encodeURIComponent(data.logStream))}`;

  console.log('data', JSON.stringify(data, null, 2));
  console.log('cloudWatchUrl', cloudWatchUrl);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/classes/publishcommand.html
  const params = {
    Subject: `Error in ${data.logGroup}`,
    Message: `AccountID: ${data.owner}\nLogGroup: ${data.logGroup}\nLogStream: ${data.logStream}\nLogUrl: ${cloudWatchUrl}\nData: ${data.logEvents[0].message}`,
    TopicArn: process.env.TopicArn,
  };

  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log('Success. Message sent:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error', err);
  }
};
