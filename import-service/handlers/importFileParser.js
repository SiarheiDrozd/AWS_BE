import * as stream from 'stream';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

const importFileParser = async (event) => {
  console.log(event);
  const s3 = new AWS.S3({region: 'us-east-1'});
  const BUCKET = process.env.CSV_BUCKET;

  try {
    const results = [];

    for (const record of event.Records) {
      const RECORD_KEY = record.s3.object.key;
      const params = {
        Bucket: BUCKET, Key: RECORD_KEY
      }
      const s3object = await s3.getObject(params).promise();
      const csvReadStream = new stream.Readable();

      csvReadStream._read = () => {};
      csvReadStream.push(s3object.Body);

      await csvReadStream
        .pipe(csv({headers: true}))
        .on('data', async (data) => {
          results.push(data);
        })

      await s3.copyObject({
        Bucket: process.env.CSV_BUCKET,
        CopySource: `${BUCKET}/${RECORD_KEY}`,
        Key: RECORD_KEY.replace('uploaded', 'parsed')
      }).promise().then(() => {
        console.log('File move: success.')
      }).catch((err) => {
        console.log('File move: error. ', err)
      });

      await s3.deleteObject({
        Bucket: BUCKET,
        Key: RECORD_KEY
      }).promise().then(() => {
        console.log('File delete: success.')
      }).catch((err) => {
        console.log('File delete: error. ', err)
      });

      console.log('results', results);
    }
  } catch (err) {
    console.log(err);
  }
}

export default importFileParser;
