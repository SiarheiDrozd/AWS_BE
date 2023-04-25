import AWS from 'aws-sdk';

const catalogBatchProcess = async (event) => {
  console.log(event);
  const records = event.Records.map(record => record.body);
  const sns = new AWS.SNS({region: 'us-east-1'});
  const params = {
    Message: `New records added: ${JSON.stringify(records)}`,
    TopicArn: 'arn:aws:sns:us-east-1:489669634691:createProductTopic'
  };

  sns.publish(params, (err, data) => {
    err ? console.log('Error', err) : console.log('Success', data.MessageId);
  });
};

export default catalogBatchProcess;
