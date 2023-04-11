import AWS from "aws-sdk";
import { v4 as uuid } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json'
}
const error = ({code, err, data}) => {
  console.log('Something went wrong. Error: ' + err, data);

  return {
    statusCode: code || 500,
    isBase64Encoded: false,
    headers: corsHeaders,
    body: 'Something went wrong. Error: ' + err,
  }
}

const props = ['count', 'title', 'description', 'price'];

const createProduct = async (event) => {
  console.log(event);

  const itemId = uuid();
  const body = JSON.parse(event.body);
  const dynamo = new AWS.DynamoDB.DocumentClient();

  try {
    const missedFromSchema = props.find(prop => !body.hasOwnProperty(prop));

    if (missedFromSchema) {
      return error({code: 400, err: `'${missedFromSchema}' property missed.`});
    }

    await dynamo.put({
      TableName: process.env.DB_STOCK,
      Item: {
        id: itemId,
        count: body.count
      }
    },(err, data) => {
      return error({err, data});
    }).promise();

    await dynamo.put({
      TableName: process.env.DB_PRODUCTS,
      Item: {
        id: itemId,
        title: body.title,
        description: body.description,
        price: body.price
      }
    },(err, data) => {
      return error({err, data});
    }).promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      isBase64Encoded: false,
      body: JSON.stringify({result: 'success'})
    };
  } catch (err) {
    return error({err});
  }
};

export default createProduct;
