import AWS from "aws-sdk";
import { v4 as uuid } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json'
}
const error = (err, data) => {
  console.log(err, data);

  return {
    statusCode: 500,
    isBase64Encoded: false,
    headers: corsHeaders,
    body: 'Something went wrong. Error: ' + err,
  }
}
const createProduct = async (event) => {
  console.log(event.queryStringParameters);
  const dynamo = new AWS.DynamoDB.DocumentClient();

  try {
    const itemId = uuid();
    const { count, title, description, price } = event.queryStringParameters;

    dynamo.put({
      TableName: 'stock',
      Item: {
        id: itemId,
        count: count
      }
    },(err, data) => {
      return error(err, data);
    });

    dynamo.put({
      TableName: 'products',
      Item: {
        id: itemId,
        count: count,
        title: title,
        description: description,
        price: price
      }
    },(err, data) => {
      return error(err, data);
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      isBase64Encoded: false,
      body: 'success'
    };
  } catch (err) {
    return error(err);
  }
};

export default createProduct;
