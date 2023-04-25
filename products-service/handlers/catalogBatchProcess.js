import AWS from 'aws-sdk';

const catalogBatchProcess = async (event) => {
  console.log(event);
  const records = event.Records.map(record => record.body);
  const sns = new AWS.SNS({region: 'us-east-1'});
  const params = {
    Message: `New records added: ${JSON.stringify(records)}`,
    TopicArn: 'arn:aws:sns:us-east-1:489669634691:createProductTopic'
  };

  try {
    const result = await sns.publish(params).promise();
    console.log('result', result);

    return result;
  } catch (err) {
    console.log(err);
  }
};

export default catalogBatchProcess;
