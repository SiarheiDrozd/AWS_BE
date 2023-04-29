import * as stream from 'stream';
import AWS from 'aws-sdk';
import csv from 'csv-parser';
import crypto from 'crypto';

const importFileParser = async (event) => {
  console.log(event);
  const s3 = new AWS.S3({region: 'us-east-1'});
  const BUCKET = process.env.CSV_BUCKET;
  const sqs = new AWS.SQS({region: 'us-east-1'});
  const sqsParams = {
    MessageAttributes: {
      Count: {
        DataType: 'String',
        StringValue: 'empty'
      }
    },
    MessageBody: '',
    MessageGroupId: crypto.randomUUID(),
    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/489669634691/catalogItemsQueue.fifo'
  };

  try {
    for (const record of event.Records) {
      const RECORD_KEY = record.s3.object.key;
      const bucketParams = {
        Bucket: BUCKET, Key: RECORD_KEY
      };
      const s3object = await s3.getObject(bucketParams).promise();
      const csvReadStream = new stream.Readable();

      csvReadStream._read = () => {
      };
      csvReadStream.push(s3object.Body);

      await csvReadStream
        .pipe(csv())
        .on('data', async (data) => {
          sqsParams.MessageAttributes.Count.StringValue = data.count ? 'stock' : 'empty';
          sqsParams.MessageBody = JSON.stringify(data);

          const sqsResult = await sqs.sendMessage(sqsParams).promise();
          console.log(sqsResult);
        });

      await s3.copyObject({
        Bucket: process.env.CSV_BUCKET,
        CopySource: `${BUCKET}/${RECORD_KEY}`,
        Key: RECORD_KEY.replace('uploaded', 'parsed')
      }).promise().then(() => {
        console.log('File move: success.');
      }).catch((err) => {
        console.log('File move: error. ', err);
      });

      await s3.deleteObject({
        Bucket: BUCKET,
        Key: RECORD_KEY
      }).promise().then(() => {
        console.log('File delete: success.');
      }).catch((err) => {
        console.log('File delete: error. ', err);
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export default importFileParser;
