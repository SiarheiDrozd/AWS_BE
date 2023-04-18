import AWS from 'aws-sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'text/plain'
}
const importProductsFile = async (event) => {
  try {
    const fileName = event.queryStringParameters.name;
    const bucketName = process.env.CSV_BUCKET;
    const s3 = new AWS.S3({region: 'us-east-1'});
    const url = s3.getSignedUrl(
      'putObject',
      {
        Bucket: bucketName,
        Key: `uploaded/${fileName}`,
        ContentType: 'text/csv',
        Expires: 60
      });

    return {
      statusCode: 200, headers: corsHeaders, body: JSON.stringify(url),
    }
  } catch (error) {
    console.error('error', error);

    return {
      statusCode: 400, headers: corsHeaders, body: JSON.stringify(error),
    };
  }
}

export default importProductsFile;
